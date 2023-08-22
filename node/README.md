> 본 문서에 작성되어 있는 오류 코드는 아직 서버에 적용되지 않은 내용<br>추후 적용 될 내용이니 읽어보고 피드백 바람

# 목차
* [Node.js 서버 API](#nodejs-서버-api)
    1. [서비스 접속](#서비스-접속)
    2. [회원 가입](#회원-가입)
    3. [로그인](#로그인)
    4. [로그아웃](#로그아웃)
    5. [유저 정보 조회](#유저-정보-조회)
    6. [차량 등록](#차량-등록)
    7. [차량 조회](#차량-조회)
    8. [업무 일지 작성](#업무-일지-작성)
    9. [업무 일지 조회](#업무-일지-조회)
    10. [공지사항 조회](#공지사항-조회)
    11. [공지사항 작성](#공지사항-작성)
* [Flask 서버 API](#flask-서버-api)
* [오류 코드](#오류-코드)


# Node.js 서버 API
아파트 관리 프로그램 유레카 프로젝트의 대부분의 기능을 담당하고 있는 HTTP 기반의 REST API입니다.

## 서비스 접속
### 요청
|HTTP|
|--|
|GET http://{address}:{port}/|

### 응답
#### 응답 바디
|데이터 타입|설명|
|--|--|
|html|정적 파일|

## 회원 가입
### 요청
|HTTP|
|--|
|POST http://{address}:{port}/user/signup/|
#### 요청 헤더
|헤더명|설명|
|--|--|
|Content-Type|바이너리 전송 형식<br>```Content-Type: application/json```|
#### 요청 바디
|필드명|필수 여부|타입|설명|
|--|--|--|--|
|dong|Yes|String|아파트 동|
|ho|Yes|String|아파트 호|
|username|Yes|String|입주민 이름|
|pw1|Yes|String|비밀번호|
|pw2|Yes|String|비밀번호 확인|
|phone1|Yes|String|전화번호|
|phone2|No|String|예비 전화번호|
|movein|Yes|String|전입일|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 요청 예시 - 모든 항목 입력
```JSON
    {
        "dong": 123,
        "ho": 456,
        "username": "example",
        "pw1": "example1!",
        "pw2": "example1!",
        "phone1": "01012341234",
        "phone2": "01012345678",
        "movein": "19991007"
    }
```
### 요청 예시 - 예비 전화번호 없음
```JSON
    {
        "dong": 123,
        "ho": 456,
        "username": "example",
        "pw1": "example1!",
        "pw2": "example1!",
        "phone1": "01012341234",
        "movein": "19991007"
    }
```

### 응답 예시
```JSON
    {
        "status": 201,
        "message": "회원가입 성공"
    }
```

### 오류
#### 오류 예시 - 비밀번호와 비밀번호 확인 불일치
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E402",
            "message": "비밀번호 불일치"
        }
    }
```
#### 오류 예시 - 필수항목 모두 입력되지 않음
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E400",
            "message": "필수 항목 미입력"
        }
    }
```
#### 오류 예시 - 이미 존재하는 회원
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E405",
            "message": "이미 존재하는 회원"
        }
    }
```


## 로그인
### 요청
|HTTP|
|--|
|POST http://{address}:{port}/user/signin/|
#### 요청 헤더
|헤더명|설명|
|--|--|
|Content-Type|바이너리 전송 형식<br>```Content-Type: application/json```|
#### 요청 바디
|필드명|필수 여부|타입|설명|
|--|--|--|--|
|dong|Yes|String|아파트 동|
|ho|Yes|String|아파트 호|
|pw|Yes|String|비밀번호|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 요청 예시
```JSON
    {
        "dong": 123,
        "ho": 456,
        "pw1": "example1!"
    }
```

### 응답 예시
```JSON
    {
        "status": 200,
        "message": "123-456 로그인 성공"
    }
```

### 오류
#### 오류 예시 - 아이디 or 비밀번호 오류
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E401",
            "message": "아이디 or 비밀번호 오류"
        }
    }
```
#### 오류 예시 - 필수항목 모두 입력되지 않음
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E400",
            "message": "필수 항목 미입력"
        }
    }
```
#### 오류 예시 - 등록되지 않은 사용자
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E403",
            "message": "등록되지 않은 사용자"
        }
    }
```


## 로그아웃
### 요청
|HTTP|
|--|
|GET http://{address}:{port}/user/signout/|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 응답 예시
```JSON
    {
        "status": 200,
        "message": "로그아웃 성공"
    }
```

### 오류
#### 오류 예시
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E404",
            "message": "세션 정보 없음"
        }
    }
```
#### 오류 예시 - 서버 에러
```JSON
    {
        "status": 500,
        "error": {
            "errorCode": "E500",
            "message": "서버 에러"
        }
    }
```


## 유저 정보 조회
### 요청
|HTTP|
|--|
|GET http://{address}:{port}/user/info/|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 응답 예시
```JSON
    {
        "status": 200,
        "message": "입주민"
    }
```

### 오류
#### 오류 예시 - 세션 정보 없음
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E404",
            "message": "세션 정보 없음"
        }
    }
```
#### 오류 예시 - 서버 에러
```JSON
    {
        "status": 500,
        "error": {
            "errorCode": "E500",
            "message": "서버 에러"
        }
    }
```


## 차량 등록
### 요청
|HTTP|
|--|
|POST http://{address}:{port}/car/regist/|
#### 요청 헤더
|헤더명|설명|
|--|--|
|Content-Type|바이너리 전송 형식<br>```Content-Type: application/json```|
#### 요청 바디
|필드명|필수 여부|타입|설명|
|--|--|--|--|
|car_number|Yes|String|차량 번호|
|guest_car|Yes|Int|손님 차량 여부|
|electric_car|Yes|Int|전기차 여부|
|disabled_car|Yes|Int|장애인 차량 여부|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 요청 예시
```JSON
    {
        "car_number": "차량번호",
        "guest_car": 0,
        "electric_car": 1,
        "disabled_car": 0
    }
```

### 응답 예시
```JSON
    {
        "status": 201,
        "message": "차량 등록 성공"
    }
```

### 오류
#### 오류 예시 - 이미 등록 된 차량
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E411",
            "message": "이미 등록 된 차량"
        }
    }
```
#### 오류 예시 - 세션 정보 없음
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E404",
            "message": "세션 정보 없음"
        }
    }
```
#### 오류 예시 - 서버 에러
```JSON
    {
        "status": 500,
        "error": {
            "errorCode": "E500",
            "message": "서버 에러"
        }
    }
```


## 차량 조회
### 요청
|HTTP|
|--|
|POST http://{address}:{port}/car/info/|
#### 요청 헤더
|헤더명|설명|
|--|--|
|Content-Type|바이너리 전송 형식<br>```Content-Type: application/json```|
#### 요청 바디
|필드명|필수 여부|타입|설명|
|--|--|--|--|
|car_number|Yes|String|차량 번호|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|value|
|--|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|
|dong|Int|아파트 동|
|ho|Int|아파트 호|
|username|String|차주 이름|
|phone1|String|전화번호|
|phone2|String|예비 전화번호|
|carNumber|String|차량 번호|
|guestCar|Int|손님 차량 여부|* 0: 본인 차량<br>* 1: 손님 차량|
|electricCar|Int|전기차 여부|* 0: 일반 차량<br>* 1: 전기차|
|disabledCar|Int|장애인 차량 여부|* 0: 일반 차량<br>* 1: 장애인 차량|

### 요청 예시
```JSON
    {
        "car_number": "차량번호"
    }
```

### 응답 예시
```JSON
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
        "disabledCar": 0
    }
```

### 오류
#### 오류 예시
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E410",
            "message": "등록되지 않은 차량"
        }
    }
```
#### 오류 예시 - 서버 에러
```JSON
    {
        "status": 500,
        "error": {
            "errorCode": "E500",
            "message": "서버 에러"
        }
    }
```


## 업무 일지 조회
### 요청
|HTTP|
|--|
|GET http://{address}:{port}/work/|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|w_l_id|Int|업무 일지 고유 아이디|
|w_w_id|Int|작성자 고유 아이디|
|w_content|String|업무일지 내용|
|w_start|String|업무 시작 일시|
|w_end|String|업무 종료 일시|
|w_w_datetime|String|업무 일지 작성 일시|

### 응답 예시
```JSON
    [
        {
            "w_l_id": 3,
            "w_w_id": 3,
            "w_content": "업무일지 내용",
            "w_start": "2023-08-18T15:00:00.000Z",
            "w_end": "2023-08-18T15:00:00.000Z",
            "w_w_datetime": "2023-08-19T11:04:54.000Z"
        },
        {
            "w_l_id": 2,
            "w_w_id": 2,
            "w_content": "업무일지 내용",
            "w_start": "2023-08-18T15:00:00.000Z",
            "w_end": "2023-08-18T15:00:00.000Z",
            "w_w_datetime": "2023-08-19T11:04:54.000Z"
        },
        {
            "w_l_id": 1,
            "w_w_id": 1,
            "w_content": "업무일지 내용",
            "w_start": "2023-08-18T15:00:00.000Z",
            "w_end": "2023-08-18T15:00:00.000Z",
            "w_w_datetime": "2023-08-19T11:03:01.000Z"
        }
    ]
```

### 오류
#### 오류 예시 - 서버 에러
```JSON
    {
        "status": 500,
        "error": {
            "errorCode": "E500",
            "message": "서버 에러"
        }
    }
```


## 업무 일지 작성
### 요청
|HTTP|
|--|
|POST http://{address}:{port}/work/write/|
#### 요청 헤더
|헤더명|설명|
|--|--|
|Content-Type|바이너리 전송 형식<br>```Content-Type: application/json```|
#### 요청 바디
|필드명|필수 여부|타입|설명|
|--|--|--|--|
|content|Yes|String|업무 내용|
|start|Yes|String|업무 시작 일자|
|end|Yes|String|업무 종료 일자|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 요청 예시
```JSON
    {
        "content": "업무일지 내용",
        "start": "19991007",
        "end": "19991007"
    }
```

### 응답 예시
```JSON
    {
	    "status": 201,
	    "message": "업무일지 작성 완료"
    }
```

### 오류
#### 오류 예시
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E400",
            "message": "필수 항목 미입력"
        }
    }
```
#### 오류 예시 - 서버 에러
```JSON
    {
        "status": 500,
        "error": {
            "errorCode": "E500",
            "message": "서버 에러"
        }
    }
```


## 공지사항 조회
### 요청
|HTTP|
|--|
|GET http://{address}:{port}/notice/|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|notice_id|Int|공지사항 고유 아이디|
|noti_w_id|Int|작성자 고유 아이디|
|title|String|제목|
|content|String|내용|
|summary|String|요약 내용|
|noti_w_date|String|작성 일시|
|noti_category|Int|카테고리|

### 응답 예시
```JSON
    [
        {
            "notice_id": 5,
            "noti_w_id": 1,
            "title": "제목",
            "content": "내용",
            "summary": "요약 내용",
            "noti_w_date": "2023-08-15T20:27:50.000Z",
            "noti_category": 1
        },
        {
            "notice_id": 4,
            "noti_w_id": 1,
            "title": "제목",
            "content": "내용",
            "summary": "요약 내용",
            "noti_w_date": "2023-08-15T20:27:50.000Z",
            "noti_category": 1
        },
        {
            "notice_id": 3,
            "noti_w_id": 1,
            "title": "제목",
            "content": "내용",
            "summary": "요약 내용",
            "noti_w_date": "2023-08-15T20:27:50.000Z",
            "noti_category": 1
        },
        {
            "notice_id": 2,
            "noti_w_id": 1,
            "title": "제목",
            "content": "내용",
            "summary": "요약 내용",
            "noti_w_date": "2023-08-15T20:27:50.000Z",
            "noti_category": 1
        },
        {
            "notice_id": 1,
            "noti_w_id": 1,
            "title": "제목",
            "content": "내용",
            "summary": "요약 내용",
            "noti_w_date": "2023-08-15T20:27:50.000Z",
            "noti_category": 1
        }
    ]
```

### 오류
#### 오류 예시
```JSON
    {
        "status": 500,
        "error": {
            "errorCode": "E500",
            "message": "서버 에러"
        }
    }
```


## 공지사항 작성
### 요청
|HTTP|
|--|
|POST http://{address}:{port}/notice/write/|
#### 요청 헤더
|헤더명|설명|
|--|--|
|Content-Type|바이너리 전송 형식<br>```Content-Type: application/json```|
#### 요청 바디
|필드명|필수 여부|타입|설명|
|--|--|--|--|
|category|Yes|Int|카테고리|
|title|Yes|String|제목|
|content|Yes|String|내용|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|
|title|String|제목|
|content|String|내용|
|summary|String|요약 내용|

### 요청 예시
```JSON
    {
        "category": 3,
	    "title": "제목",
	    "content": "내용"
    }
```

### 응답 예시
```JSON
    {
        "status": 201,
        "message": "요약 성공",
        "title": title,
        "content": content,
        "summary": summary
    }
```

### 오류
#### 오류 예시
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E400",
            "message": "필수 항목 미입력"
        }
    }
```


# Flask 서버 API


# 오류 코드
|HttpStatusCode|ErrorCode|ErrorMessage|
|--|--|--|
|400|E400|필수 항목 미입력|
|400|E401|아이디 or 비밀번호 오류|
|400|E402|비밀번호 불일치|
|400|E403|등록되지 않은 사용자|
|400|E404|세션 정보 없음|
|400|E405|이미 존재하는 회원|
|400|E410|등록되지 않은 차량|
|400|E411|이미 등록 된 차량|
|500|E500|서버 에러|
|500|E501|차량 등록 실패|