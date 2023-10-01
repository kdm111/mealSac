class UploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      file =>
        new Promise((resolve, reject) => {
          this._initRequest();
          this._initListeners(resolve, reject, file);
          this._sendRequest(file);
        }),
    );
  }

  _initRequest() {
    const xhr = (this.xhr = new XMLHttpRequest());
    // 경로 변수화
    const currentUrl = window.location.origin;
    const uploadUrl = `/api/post/uploadImg`;
    xhr.open('POST', uploadUrl, true);
    xhr.responseType = 'json';
  }

  _initListeners(resolve, reject, file) {
    const xhr = this.xhr;
    const loader = this.loader;
    const genericErrorText = '파일을 업로드 할 수 없습니다.';

    xhr.addEventListener('error', () => {
      reject(genericErrorText);
    });
    xhr.addEventListener('abort', () => reject());
    xhr.addEventListener('load', () => {
      const response = xhr.response;
      if (!response || response.error) {
        return reject(
          response && response.error
            ? response.error.message
            : genericErrorText,
        );
      }

      resolve({
        // response = { "success": true, "msg": "파일이 성공적으로 업로드되었습니다.", url: "http://localhost:8000/static/profileImg/qwodqwo.jpg"}
        default: response.url, //업로드된 파일 주소
      });
    });
  }

  _sendRequest(file) {
    const data = new FormData();
    data.append('imageFiles', file);
    console.log(data);
    this.xhr.send(data);
  }
}

let editor;

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get('FileRepository').createUploadAdapter = loader => {
    return new UploadAdapter(loader);
  };
}

ClassicEditor.create(document.querySelector('.editor'), {
  extraPlugins: [MyCustomUploadAdapterPlugin],
})
  .then(newEditor => {
    editor = newEditor;
  })
  .catch(error => {
    console.error(error);
  });

// 작성
// 작성한 글을 포스트로 요청
document.getElementById('postBtn').addEventListener('click', function (event) {
  event.preventDefault(); // 페이지 리프레시 방지

  const editorData = editor.getData();
  const title = document.getElementById('inputTitle').value;
  if (!title) {
    alert('제목을 작성해주세요')
    return ;
  }
  const boardType = document.getElementById('boardType').value;
  let board_id;
  if (boardType === 'notice') {
    board_id = 1;
  } else {
    board_id = 2;
  }

  // 서버에 데이터 전송
  fetch('/api/post/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: title,
      content: editorData,
      board_id,
    }),
  })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        alert('글이 성공적으로 작성되었습니다.');
        window.location.href = '/board';
      } else {
        alert('글 작성에 실패했습니다: ' + data.message);
      }
    })
    .catch(error => {
      alert('오류가 발생했습니다: ' + error.message);
    });
});

// 취소
// 원래 있던 게시판으로 돌아가도록
document.getElementById('backBtn').addEventListener('click', function () {
  window.location.href = '/board';
});
