chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: async () => {
        let probNameElement, probName, probNum, solution, formattedSolution,
          fileEx, runtimeText, memoryText, commitMsg, fileName, solutionsId;
        const fileExs = {
          'C': '.c',
          'C++': '.cpp',
          'C#': '.cs',
          'Dart': '.dart',
          'Elixir': '.ex',
          'Erlang': '.erl',
          'Go': '.go',
          'Java': '.java',
          'JavaScript': '.js',
          'Kotlin': '.kt',
          'PHP': '.php',
          'Python': '.py',
          'Python3': '.py',
          'Racket': '.rkt',
          'Ruby': '.rb',
          'Rust': '.rs',
          'Scala': '.scala',
          'Swift': '.swift',
          'TypeScript': '.ts',
          'MySQL':'sql'
        };

        const localStorageExs = {
          'C': 'c',
          'C++': 'cpp',
          'C#': 'csharp',
          'Dart': 'dart',
          'Elixir': 'elixir',
          'Erlang': 'erlang',
          'Go': 'golang',
          'Java': 'java',
          'JavaScript': 'javascript',
          'Kotlin': 'kotlin',
          'PHP': 'php',
          'Python': 'python',
          'Python3': 'python3',
          'Racket': 'racket',
          'Ruby': 'ruby',
          'Rust': 'rust',
          'Scala': 'scala',
          'Swift': 'swift',
          'TypeScript': 'typeScript',
          'MySQL':'mysql'
        };

        probNameElement = document.querySelector(
          'div.flex.items-start.justify-between.gap-4 > div.flex.items-start.gap-2 > div > a'
        );
        probNum = probNameElement.innerText.split('.')[0];
        probName = probNameElement.innerText
          .replace('.', '')
          .replaceAll(' ', '-');

        if (window.location.href.includes('submissions')) {
          const solutionLangText = document.querySelector(
            'div.w-full.flex-1.overflow-y-auto > div > div:nth-child(3) > div.flex.items-center.gap-2.pb-2.text-sm.font-medium.text-text-tertiary.dark\\:text-text-tertiary'
          ).lastChild.nodeValue;

          solutionsId = localStorage.key(0).split('_')[1];
          solution = localStorage.getItem(`${probNum}_${solutionsId}_${localStorageExs[solutionLangText]}`);

          await checkSolInLocalStorage(solution);

          if (solutionLangText) {
            fileEx = fileExs[solutionLangText];
          }
          fileName = `${probName}${fileEx}`;
          await sessionStorage.setItem('fileName', fileName);

          const runtime =  [...document.querySelectorAll('div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(3) > span.font-semibold')][0]??'NULL';
          const memory =  [...document.querySelectorAll('div.flex.items-center.justify-between.gap-2 > div > div.rounded-sd.flex.min-w-\\[275px\\].flex-1.cursor-pointer.flex-col.px-4.py-3.text-xs > div:nth-child(3) > span.font-semibold')][1]??'NULL';
          
          commitMsg = `[${probNum}]` ;
          if (runtime ) {
            runtimeText = runtime.innerText;
            commitMsg +=`[Time Beats: ${runtimeText}] `;
          }if ( memory) {
            memoryText = memory.innerText;
            commitMsg+=`[Memory Beats: ${memoryText}]`;
          }

          commitMsg = ` - LeetPush`;
          await sessionStorage.setItem('commitMsg', commitMsg);
        }

        const lpDiv = document.createElement('div');
        const lpBtn = document.createElement('button');
        const lpDivStyle = document.createElement('style');
        lpDiv.id = 'leetpush-div';
        lpBtn.id = 'leetpush-btn';
        lpBtn.textContent = 'Push';
        lpBtn.addEventListener('click', () => pushOnClick());
        lpDiv.appendChild(lpBtn);
        document.head.appendChild(lpDivStyle);

        const accepted = document.querySelector(
          'div.flex.h-full.w-full.flex-col.overflow-hidden.rounded > div > div > div.w-full.flex-1.overflow-y-auto > div > div.flex.w-full.items-center.justify-between.gap-4 > div.flex.flex-1.flex-col.items-start.gap-1.overflow-hidden > div.text-green-s.dark\\:text-dark-green-s.flex.flex-1.items-center.gap-2.text-\\[16px\\].font-medium.leading-6 > span'
        );
        const submissionsPage = window.location.href.includes('submissions');
        const existingLPDiv = document.querySelector('#leetpush-div');
        if (submissionsPage && !existingLPDiv && accepted) {
          const btnParent = document.querySelector(
            'div.flex.justify-between.py-1.pl-3.pr-1 > div.relative.flex.overflow-hidden.rounded.bg-fill-tertiary.dark\\:bg-fill-tertiary.\\!bg-transparent > div.flex-none.flex > div:nth-child(2)'
          );
          if (btnParent) btnParent.appendChild(lpDiv);
        }

        const modalDiv = document.createElement('div');
        modalDiv.id = 'lp-modal';
        const containerDiv = document.createElement('div');
        containerDiv.id = 'lp-container';
        const h3 = document.createElement('h3');
        h3.textContent = 'Leet';
        const span = document.createElement('span');
        span.textContent = 'Push';
        h3.appendChild(span);
        const form = document.createElement('form');
        form.id = 'lp-form';
        const repoNameDiv = document.createElement('div');
        repoNameDiv.className = 'lp-div';
        const repoNameLabel = document.createElement('label');
        repoNameLabel.textContent = 'Repository URL:';
        const repoNameInput = document.createElement('input');
        repoNameInput.type = 'text';
        repoNameInput.id = 'repo-url';
        repoNameInput.name = 'repo-url';
        repoNameInput.required = true;
        repoNameDiv.appendChild(repoNameLabel);
        repoNameDiv.appendChild(repoNameInput);
        const tokenDiv = document.createElement('div');
        tokenDiv.className = 'lp-div';
        const tokenLabel = document.createElement('label');
        const howToCreateToken = document.createElement('a');
        howToCreateToken.textContent = 'Generate Token?';
        howToCreateToken.href = 'https://scribehow.com/shared/Generating_a_personal_access_token_on_GitHub__PUPxxuxIRQmlg1MUE-2zig';
        howToCreateToken.setAttribute('target', '_blank');
        tokenLabel.textContent = 'Token:';
        tokenLabel.appendChild(howToCreateToken);
        tokenDiv.appendChild(tokenLabel);
        const tokenInput = document.createElement('input');
        tokenInput.type = 'text';
        tokenInput.id = 'token';
        tokenInput.name = 'token';
        tokenInput.required = true;
        tokenDiv.appendChild(tokenLabel);
        tokenDiv.appendChild(tokenInput);
        const radioDivMaster = document.createElement('div');
        const radioDivMain = document.createElement('div');
        radioDivMaster.className = 'radio-div';
        radioDivMain.className = 'radio-div';
        const branchDiv = document.createElement('div');
        branchDiv.id = 'lp-radios';
        const masterRadio = document.createElement('input');
        masterRadio.type = 'radio';
        masterRadio.id = 'branch-master';
        masterRadio.name = 'branch-name';
        masterRadio.value = 'master';
        const masterLabel = document.createElement('label');
        masterLabel.textContent = 'master';
        const mainRadio = document.createElement('input');
        mainRadio.type = 'radio';
        mainRadio.id = 'branch-main';
        mainRadio.name = 'branch-name';
        mainRadio.value = 'main';
        const mainLabel = document.createElement('label');
        mainLabel.textContent = 'main';
        branchDiv.appendChild(radioDivMain);
        branchDiv.appendChild(radioDivMaster);
        radioDivMaster.appendChild(masterRadio);
        radioDivMaster.appendChild(masterLabel);
        radioDivMain.appendChild(mainRadio);
        radioDivMain.appendChild(mainLabel);
        const submitBtn = document.createElement('button');
        submitBtn.id = 'lp-submit-btn';
        submitBtn.type = 'submit';
        submitBtn.textContent = 'Submit';
        form.appendChild(repoNameDiv);
        form.appendChild(tokenDiv);
        form.appendChild(branchDiv);
        form.appendChild(submitBtn);
        containerDiv.appendChild(h3);
        containerDiv.appendChild(form);
        modalDiv.appendChild(containerDiv);

        submitBtn.addEventListener('click', (event) => {
          event.preventDefault();

          const repoUrl = document.querySelector('#repo-url').value;
          const token = document.querySelector('#token').value;
          const branch = document.querySelector(
            'input[name="branch-name"]:checked'
          ).value;

          localStorage.setItem('repo', repoUrl);
          localStorage.setItem('token', token);
          localStorage.setItem('branch', branch);

          document.body.removeChild(modalDiv);
        });

        async function pushOnClick() {
          const token = localStorage.getItem('token');
          const repo = localStorage.getItem('repo');
          const branch = localStorage.getItem('branch');
          if (!token || !repo || !branch) {
            document.body.appendChild(modalDiv);
            if (token) document.querySelector('#token').value = token;
            if (repo) document.querySelector('#repo-url').value = repo;
            if (branch) document.querySelector(`#branch-${branch}`).checked = true;
            return;
          }

          const [repoName, userName] = repo.split('/').slice(3, 5);

          lpBtn.disabled = true;
          lpBtn.textContent = 'Loading...';

          await pushToGithub(
            repoName,
            userName,
            branch,
            sessionStorage.getItem('fileName'),
            sessionStorage.getItem('solution'),
            sessionStorage.getItem('commitMsg'),
            token
          );

          await sleep(2000);
          lpBtn.textContent = 'Done';
          await sleep(2000);
          lpBtn.disabled = false;
          lpBtn.textContent = 'Push';
        }

        async function pushToGithub(
          userName,
          repoName,
          branch,
          fileName,
          content,
          commitMsg,
          token
        ) {
          const apiUrl = `https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}`;
          const fileExistsResponse = await fetch(`https://api.github.com/repos/${userName}/${repoName}/contents/${fileName}?ref=${branch}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (fileExistsResponse.ok) {
            const updateResponse = await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                message: commitMsg,
                content: btoa(content),
                sha: (await fileExistsResponse.json()).sha
              })
            });
          } else {
            const createResponse = await fetch(apiUrl, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
              },
              body: JSON.stringify({
                message: commitMsg,
                content: btoa(content),
                branch: branch
              })
            });
          }
        }

        async function checkSolInLocalStorage(sol) {
          if (sol) {
            formattedSolution = sol
              .replace(/\\n/g, '\n')
              .replace(/  /g, '  ')
              .replace(/"/g, '');
            await sessionStorage.setItem('solution', formattedSolution);
          } else {
            const code = document.querySelector('div.px-4.py-3 > div > pre > code').innerText;
            await sessionStorage.setItem('solution', code);
          }
        }

        function sleep(ms) {
          return new Promise(resolve => setTimeout(resolve, ms));
        }
      }
    });
  }
});
