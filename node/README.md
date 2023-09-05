# 목차
* [Node.js 서버 API](#nodejs-서버-api)
    1. [서비스 접속](#서비스-접속)
    2. [회원 가입](#회원-가입)
    3. [로그인](#로그인)
    4. [로그아웃](#로그아웃)
    5. [유저 정보 조회](#유저-정보-조회)
    6. [차량 등록](#차량-등록)
    7. [차량 조회](#차량-조회)
    8. [모든 차량 조회](#모든-차량-조회)
    9. [차량 등록 승인](#차량-등록-승인)
    10. [차량 등록 거부](#차량-등록-거부)
    11. [업무 일지 작성](#업무-일지-작성)
    12. [업무 일지 조회](#업무-일지-조회)
    13. [공지사항 조회](#공지사항-조회)
    14. [공지사항 작성](#공지사항-작성)
    15. [민원 작성](#민원-작성)
    16. [민원 조회](#민원-조회)
* [오류 코드](#오류-코드)
* [Flask 서버 API](#Flask-서버-API)
* [Flask 오류 코드](#Flask 오류 코드)


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
|results|JSON|응답 메시지|
|dong|String|아파트 동|
|ho|String|아파트 호|
|username|String|입주민 이름|
|movein|String|전입일|
|phone1|String|전화번호|
|phone2|String|예비 전화번호|

### 응답 예시
```JSON
    {
	    "status": 200,
	    "results": [
		    {
			    "dong": "111",
			    "ho": "222",
			    "username": "유레카",
			    "movein": "2023-08-07T15:00:00.000Z",
			    "phone1": "12345555",
			    "phone2": "12345555"
		    }
        ]
    }
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
#### 오류 예시 - 승인 대기 중 차량
```JSON
    {
        "status": 400,
        "error": {
            "errorCode": "E412",
            "message": "승인 대기 중 차량"
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


## 모든 차량 조회
### 요청
|HTTP|
|--|
|GET http://{address}:{port}/car/registered/|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|results|JSON|응답 메시지|
|rcars|JSON|등록 된 차량|
|nrcars|JSON|등록 되지 않은 차량|

### 응답 예시
```JSON
    {
	    "status": 200,
	    "results": {
		    "rcars": [],
		    "nrcars": [
			    {
				    "car_id": 1,
				    "car_r_id": 1,
				    "car_number": "차량번호",
				    "guest_car": 0,
				    "electric_car": 1,
				    "disabled_car": 0,
				    "registered": 0,
				    "registration_datetime": "2023-08-10T22:17:00.000Z",
				    "application_datetime": null
			    }
            ]
        }
    }
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


## 차량 등록 승인
### 요청
|HTTP|
|--|
|PUT http://{address}:{port}/car/approve/|
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
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 응답 예시
```JSON
    {
	    "status": 201,
	    "message": "차량 등록 성공"
    }
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


## 차량 등록 거부
### 요청
|HTTP|
|--|
|DELETE http://{address}:{port}/car/deny/|
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
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 응답 예시
```JSON
    {
	    "status": 201,
	    "message": "차량 등록 거부"
    }
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
    {
	    "status": 200,
	    "message": "업무일지 조회 성공",
	    "results": [
		    {
			    "w_l_id": 3,
			    "w_w_id": 12,
			    "w_content": "업무일지 내용",
			    "w_start": "2023-08-18T15:00:00.000Z",
			    "w_end": "2023-08-18T15:00:00.000Z",
			    "w_w_datetime": "2023-08-19T11:04:54.000Z"
		    },
		    {
			    "w_l_id": 2,
			    "w_w_id": 12,
			    "w_content": "업무일지 내용",
			    "w_start": "2023-08-18T15:00:00.000Z",
			    "w_end": "2023-08-18T15:00:00.000Z",
			    "w_w_datetime": "2023-08-19T11:04:54.000Z"
		    },
		    {
			    "w_l_id": 1,
			    "w_w_id": 12,
			    "w_content": "업무일지 내용",
			    "w_start": "2023-08-18T15:00:00.000Z",
			    "w_end": "2023-08-18T15:00:00.000Z",
			    "w_w_datetime": "2023-08-19T11:03:01.000Z"
		    }
	    ]
    }
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
    {
        "status": 200,
	    "message": "공지사항 조회 성공",
	    "results": [
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
    }
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
|content2|Yes|String|html 태그 포함 내용|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 요청 예시
```JSON
    {
        "category": 1,
	    "title": "제목",
	    "content": "내용",
        "content2": "<h1>내용</h1>"
    }
```

### 응답 예시
```JSON
    {
        "status": 201,
        "message": "공지사항 작성 성공"
    }
```
### 응답 예시 - 클로바 요약 에러
```JSON
    {
        "status": 201,
        "message": "요약 없이 작성"
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


## 민원 작성
### 요청
|HTTP|
|--|
|POST http://{address}:{port}/complaint/write/|
#### 요청 헤더
|헤더명|설명|
|--|--|
|Content-Type|바이너리 전송 형식<br>```Content-Type: application/json```|
#### 요청 바디
|필드명|필수 여부|타입|설명|
|--|--|--|--|
|title|Yes|String|제목|
|content|Yes|String|내용|
|content2|Yes|String|html 태그 포함 내용|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|

### 요청 예시
```JSON
    {
	    "title": "제목",
	    "content": "내용",
        "content2": "<h1>내용</h1>"
    }
```

### 응답 예시
```JSON
    {
        "status": 201,
        "message": "제출 성공"
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


## 민원 조회
### 요청
|HTTP|
|--|
|GET http://{address}:{port}/complaint/|

### 응답
#### 응답 바디
|필드 이름|데이터 타입|설명|
|--|--|--|
|status|Int|상태 코드|
|message|String|응답 메시지|
|results|JSON|민원 목록|

### 응답 예시
```JSON
    {
	    "status": 200,
	    "message": "민원 조회 성공",
	    "results": [
		    {
			    "complaint_id": 2,
			    "c_w_id": 1,
			    "title": "민원 제목",
			    "content": "민원 내용...",
			    "created_datetime": "2023-08-31T05:41:26.000Z"
		    },  
		    {
			    "complaint_id": 1,
			    "c_w_id": 12,
			    "title": "제목 테스트",
			    "content": "내용 테스트",
			    "created_datetime": "2023-08-23T05:11:13.000Z"
		    }
	    ]
    }
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


# 오류 코드
|HttpStatusCode|ErrorCode|ErrorMessage|
|--|--|--|
|400|E400|필수 항목 미입력|
|400|E401|아이디 or 비밀번호 오류|
|400|E402|비밀번호 불일치|
|400|E403|등록되지 않은 사용자|
|400|E404|세션 정보 없음|
|400|E405|이미 존재하는 회원|
|400|E406|이미 로그인 되어 있음|
|400|E410|등록되지 않은 차량|
|400|E411|이미 등록 된 차량|
|400|E412|승인 대기 중 차량|
|403|E420|관리자 권한 필요|
|500|E500|서버 에러|
|500|E501|차량 등록 실패|


# Flask 서버 API
## 요청
1. 클라이언트에서 다음의 주소로 이미지를 업로드 한다.

```
POST http://{address}:{port}/predict
```

```python
if request.method == 'POST':
        f = request.files['file']
        upload_path = os.path.join(app.config['UPLOAD_FOLDER'], secure_filename(f.filename))
        f.save(upload_path)

        recognizer = LicensePlateRecognizer()
        license_plate_images = recognizer.recognize_license_plates(upload_path)
```

2. 서버에서는 이미지를 받고, Yolov5를 이용해 차량 번호판 위치를 특정짓고, EasyOCR을 사용해 번호판값을 추출한다. [detect.py 파일](https://github.com/gaon12/eureka/blob/main/server/detect.py)에서 EasyOCR을 이용해 추출.

```python
# 각 번호판 이미지의 텍스트 추출 및 출력
        for image in license_plate_images:
            result = recognizer.read_text(image)

        data_to_send = {
            "car_number": result
        }
```

3. Node.js 서버로 값을 보낸다.
```python
# send_request 함수
def send_request(data_to_send, retries=3, config_path='config.json'):
    with open(config_path, 'r') as config_file:
        config = json.load(config_file)

    nodejs_server_url = config.get('nodejs_car_info', '')

    for _ in range(retries):
        try:
            response = requests.post(nodejs_server_url, json=data_to_send)
            response_data = response.json()

            if response.status_code == 200:
                return response_data
        except requests.exceptions.RequestException:
            pass

    return None
```

4. Node.js의 결과값을 프론트엔드로 전송
```python
# send_request 함수를 통해 요청 보내고 결과 받기
        response_data = send_request(data_to_send)
        try:
            os.remove(upload_path)
            print("File deleted successfully.")
        except OSError as e:
            print("Error:", e)

        if response_data is not None:
            # JSON 데이터를 그대로 클라이언트로 전송
            response = Response(json.dumps(response_data), status=200, mimetype='application/json')
            return response
        else:
            # Node.js 서버 응답이 실패한 경우
            error_response = {"error": "Failed to get response from Node.js server"}
            return Response(json.dumps(error_response), status=500, mimetype='application/json')
```

# Flask 오류 코드
|HttpStatusCode|ErrorCode|ErrorMessage|
|--|--|--|
|400|F400|올바르지 않는 확장자|
|400|F401|번호판 인식 실패|
|400|F402|있을 수 없는 용도기호|
|500|F500|Node.js서버와의 연결 실패|
