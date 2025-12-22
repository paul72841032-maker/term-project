이 프로젝트는 term-project의 웹 개발을 위한 코드를 담고 있습니다. 
간단한 커뮤니티 웹으로 내가 남기고 싶은 글을 작성하여 남길 수 있도록 만들었습니다. 
내가 작성한 글의 내용이 맘에 들지 않는다면 수정과 삭제가 가능하도록 하였습니다. 
vue와 vite를 사용하여 기본 개발을 진행하였으며,
jcloud로 베포를 하여 
접속하기 위해서는 http://113.198.66.68:18061/ 이 주소로 들어가야 합니다. 
firebase의 로그인 제공 서비스를 통하여 구글과 애플로 로그인이 가능하게 하였습니다. 
또한 firebase에서 제공하는 firestore database를 활용하여 작성된 글이 저장되고 또한 모바일 앱과 연동되어 작동하도록 만들었습니다. 
.env에 
VITE_FIREBASE_API_KEY=AIzaSyBw3FY07hI17hR_7KP84avpNE2-I1qtqhM
VITE_FIREBASE_AUTH_DOMAIN=term-project-87561.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=term-project-87561
VITE_FIREBASE_STORAGE_BUCKET=term-project-87561.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=99863140088
VITE_FIREBASE_APP_ID=1:99863140088:web:cdd1ca56185d226b890d0d 
다음과 같이 환경변수를 선언하였습니다. 

실행 방식은 사이트에 접속하신 후에 로그인을 진행하고, 후에 글을 작성하거나, 작성된 글을 둘러볼 수 있도록 만들었습니다. 
글 작성을 누르면 주제를 정하고 제목과 글 내용을 작성하여 포스팅하도록 만들었습니다. 만약 글이 만족스럽지 못하다면 내용을 수정하거나 삭제하는 기능도 포함하였습니다. 
