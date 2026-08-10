/** node.js module import */
const express = require("express"); // express
const session = require("express-session"); // express 세션 설정
const path = require("path"); // 경로 설정
const bodyParser = require("body-parser"); // JSON 파싱
const cors = require("cors"); // CORS 설정
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const lusca = require("lusca");

dotenv.config();

/** node.js application initialize */
const app = express();
// 라우팅 파일 연결
const userRouter = require("./route/userRouter");
const carRouter = require("./route/carRouter");
const noticeRouter = require("./route/noticeRouter");
const workRouter = require("./route/workRouter");
const complaintRouter = require("./route/complaintRouter");
const { apiLimiter } = require("./middleware/rateLimiters");

const defaultOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://127.0.0.1:3000",
];
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins.join(","))
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);
const isProduction = process.env.NODE_ENV === "production";
const sessionName = process.env.SESSION_KEY || "eureka.sid";
const trustProxy = process.env.TRUST_PROXY === "true" ? 1 : false;

if (isProduction && !process.env.SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set in production.");
}

app.set("port", process.env.NODE_PORT || 3000); // 포트 지정
app.set("trust proxy", trustProxy);
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);
app.use(express.static(path.join(__dirname, "/build"))); // 정적 파일 경로
app.use(bodyParser.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: false, limit: "1mb" }));
app.use(morgan(isProduction ? "combined" : "dev"));

/** connect config file */
const sessionOption = require("./lib/sessionOption");
var MySQLStore = require("express-mysql-session")(session);
var sessionStore = new MySQLStore(sessionOption); // MySQL에 세션 저장

/** set session */
app.use(
  session({
    name: sessionName,
    httpOnly: true,
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    },
  }),
);
if (process.env.ENABLE_CSRF === "true") {
  app.use(lusca.csrf());
}

/** routing */
app.use(apiLimiter);
app.use("/user", userRouter);
app.use("/car", carRouter);
app.use("/notice", noticeRouter);
app.use("/work", workRouter);
app.use("/complaint", complaintRouter);

app.use((err, req, res, next) => {
  console.error(err);

  if (res.headersSent) {
    return next(err);
  }

  return res.status(500).json({
    status: 500,
    error: {
      errorCode: "E500",
      message: "서버 에러",
    },
  });
});

/** /GET, 서비스 접속 메서드
 *  라우팅은 리액트에서 관리하므로 다른 페이지로 이동하는 별도의 API는 제공하지 않음
 */
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "/build/index.html"));
});

app.listen(app.get("port"), () => {
  console.log(`Node.js server listening at port ${app.get("port")}`);
});
