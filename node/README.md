# API
### 서비스 접속
##### 요청 예시
```shell
curl --request GET \
  --url http://server/
```

### 회원가입
##### 요청 예시
```shell
curl --request POST \
  --url http://server/user/signup \
  --header 'Content-Type: application/json' \
  --data '{
	"dong": 123,
	"ho": 456,
	"username": "유레카",
	"pw1": "password",
	"pw2": "password",
	"phone1": "01012341234",
	"phone2": "01012345678",
	"movein": "20231007"
}'
```
##### 요청 예시 - 예비 전화번호 없을 때
```shell
curl --request POST \
  --url http://server/user/signup \
  --header 'Content-Type: application/json' \
  --data '{
	"dong": 123,
	"ho": 456,
	"username": "유레카",
	"pw1": "password",
	"pw2": "password",
	"phone1": "01012341234",
	"movein": "20231007"
}'
```
##### 응답 예시 - 회원가입 성공
``` JSON
{
  "status": 201,
  "message": "회원가입 성공"
}
```
##### 응답 예시 - 비밀번호와 비밀번호 확인 불일치
``` JSON
{
  "status": 400,
  "message": "비밀번호 재확인 필요"
}
```
##### 응답 예시 - 필수항목 모두 입력되지 않음
``` JSON
{
  "status": 400,
  "message": "필수 항목 입력 필요"
}
```
##### 응답 예시 - 이미 존재하는 회원
``` JSON
{
  "status": 409,
  "message": "이미 존재하는 회원"
}
```

### 로그인
##### 요청 예시
``` shell
curl --request POST \
  --url http://server/user/signin \
  --header 'Content-Type: application/json' \
  --data '{
	"dong": 123,
	"ho": 456,
	"pw": "password"
}'
```
##### 응답 예시 - 로그인 성공
``` JSON
{
  "status": 200,
  "message": "123-456 로그인 성공"
}
```
##### 응답 예시 - 필수 항목 입력 필요
``` JSON
{
  "status": 400,
  "message": "필수 항목 입력 필요"
}
```
##### 응답 예시 - 비밀번호 불일치
``` JSON
{
  "status": 401,
  "message": "비밀번호 불일치"
}
```
##### 응답 예시 - 등록되지 않은 사용자
``` JSON
{
  "status": 401,
  "message": "등록되지 않은 사용자"
}
```

### 로그아웃
##### 요청 예시
``` shell
curl --request GET \
  --url http://server/user/signout
```
##### 응답 예시 - 로그아웃 성공
``` JSON
{
  "status": 200,
  "message": "로그아웃 성공"
}
```
##### 응답 예시 - 로그인 되어 있지 않은 상태
``` JSON
{
  "status": 401,
  "message": "로그인 되지 않음"
}
```
##### 응답 예시 - 서버 처리 실패
``` JSON
{
  "status": 500,
  "message": 에러 메시지
}
```

### 공지사항 등록
##### 요청 예시
``` shell
curl --request POST \
  --url http://server/notice/write \
  --header 'Content-Type: application/json' \
  --data '{
	"category": 1,
	"title": "90도 꺾인 가로등…태풍 ‘카눈’ 지나간 부산은 지금",
	"content": "제6호 태풍 ‘카눈’이 남해안에 상륙한 10일 오전 부산은 바람이 거세지고 폭우가 쏟아지고 있다. 가로등이 쓰러지거나 택시승강장이 비스듬하게 기우는 등 피해가 발생하고 있는 가운데 시민들은 바람과 비를 막으며 출근길을 재촉했다. 기상청은 이날 하루 부산에 100~200㎜, 많은 곳은 300㎜ 이상 비가 내릴 것으로 예보했다. 부산시는 도심 지하차도 등 23곳의 차량 운행을 통제했다. 온천천 등 하천변 산책로 등 101곳의 출입을 금지했다. 침수나 건물 붕괴가 우려되는 264가구 주민 433명을 대피시켰다. 부산시교육청은 10일 학생 안전을 위해 유치원과 초·중·고교 등 980여개 학교의 수업을 원격으로 전환했다. 어린이집 1440여곳 전체에는 휴원하라고 통보했다. 각 학교의 돌봄 교실을 운영하되 태풍이 근접하는 시간에는 이동 자제를 요청했다. 부산교통공사는 10일 첫차부터 도시철도 1~4호선 지상구간 열차 운행을 중단했다. 해당 구간은 1호선 노포~교대, 2호선 양산~율리, 3호선 대저~구포, 4호선 안평~반여농산물시장이다. 태풍이 물러가면 선로 점검을 한 뒤 정상 운행을 할 계획이다."
}'
```
##### 응답 예시 - 요약 성공
``` JSON
{
  "status": 201,
  "message": "요약 성공"
}
```

### 차량 등록
##### 요청 예시
``` shell
curl --request POST \
  --url http://server/car/regist \
  --header 'Content-Type: application/json' \
  --data '{
	"car_number": "차량번호",
	"guest_car": 0,
	"electric_car": 1,
	"disabled_car": 0
}'
```
##### 응답 예시 - 차량 등록 성공
``` JSON
{
  "status": 201,
  "message": "차량 등록 성공"
}
```
##### 응답 예시 - 이미 등록 된 차량
``` JSON
{
  "status": 400,
  "message": "이미 등록 된 차량"
}
```

### 차량 검색
##### 요청 예시
``` shell
curl --request GET \
  --url http://server/car/info \
  --header 'Content-Type: application/json' \
  --data '{
	"car_number": "차량번호"
}'
```
##### 응답 예시 - 차량 조회 성공
``` JSON
{
  "status": 200,
  "message": "차량 정보 조회 성공",  
  "dong": 123,  
  "ho": 456,  
  "username": "유레카",  
  "phone1": "01012341234",  
  "phone2": "01012345678",  
  "carNumber": "차량번호",  
  "guestCar": 0,  
  "electricCar": 1,  
  "disabledCar": 0,  
  "registered": 1
}
```
##### 응답 예시 - 미등록 차량
``` JSON
{
  "status": 404,
  "message": "미등록 차량"
}
```