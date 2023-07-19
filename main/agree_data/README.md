# 이 저장소는 무엇인가요?
마크다운 파일을 특정 div에 출력하는 read_md 함수를 제공합니다.

# 의존성
이 자바스크립트 함수는 [marked](https://github.com/markedjs/marked)와 동시에 사용해야 하는 의존성을 가지고 있습니다. 따라서 다음과 같은 순서대로 로드해야 합니다.

1. 마크다운 내용을 출력할 div(id가 설정되어 있어야 함.)
2. marked 자바스크립트
3. read_md 자바스크립트
4. read_md 함수 호출

# 주의사항
1. 의존성이 있으므로 **반.드.시!** marked 자바스크립트를 불러오시기 바랍니다.
<code><script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script></code>
2. 위의 의존성 문단에 적혀져 있는 순서대로 코드를 작성하시기 바랍니다.
3. **<code>file://</code>** 프로토콜에서는 **<code>CORS</code>** 오류가 발생하여 정상적으로 작동되지 않습니다. 그래서 <code>file://</code> 프로토콜에서 실행하는 경우, <code>Not available on the 'file://' protocol.</code> 알림창이 뜨도록 했습니다.

# 사용 방법
<code>read_md("파일명", "출력할 div의 id");</code> 형식으로 입력하면 됩니다.

예 : <code>read_md("README.md", "repo_div");</code>

# 라이선스
MIT 라이선스로 배포됩니다.

# What is this repository?
Provides a read_md function that outputs a markdown file to a specific div.

# Dependency
This JavaScript function has a dependency that must be used concurrently with [marked] (https://github.com/markedjs/marked) . Therefore, you must load in the following order.

1. Div to output markdown contents (id must be set)
2. marked JavaScript
3. read_md JavaScript
4. Call read_md function

# Precautions
1. There is dependency, so **van.de.si!** Please load the marked JavaScript.
<code><script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script></code>
2. Please write the code in the order listed in the dependency paragraph above.
3. **<code>file://</code>** Protocol encountered a **<code>CORS</code>** error and did not work properly. So, if you are running on the <code>file://</code> protocol, the <code>Not available on the 'file://' protocol.</code> notification window appears.

# How to use it
Type <code>read_md (file name, id of div to output);</code> format.

예 : <code>read_md(README.md, repo_div);</code>

# Licenses
Distributed under the MIT license.
