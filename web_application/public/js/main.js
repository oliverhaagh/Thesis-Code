$(document).ready(function() {
    let fileUploader = $("#fileUploader");
    let textArea = $("#textinput");
    let sendBtn = $("#sendBtn");
    let resultDiv = $("#result");
    let clearBtn = $("#clearBtn");
    let fileContent;

    textArea.on('change', () => {
        fileContent = textArea.val();
    });

    fileUploader.on('change', () => {
        let file = fileUploader.prop('files')[0];
        if (file) {
            let reader = new FileReader();
            reader.onloadend = function () {
                fileContent = reader.result;
                textArea.val(fileContent);
            };
            reader.readAsText(file);
        }
    });

    sendBtn.click(() => {
        let file = fileUploader.prop('files')[0];
        let toBeSent;
        if (fileContent) {
            toBeSent = fileContent;
        } else if (file) {
            let reader = new FileReader();
            reader.onloadend = function () {
                toBeSent = reader.result;
                textArea.val(toBeSent);
            };
            reader.readAsText(file);
        } else if (textArea.val()) {
            toBeSent = textArea.val();
        }
        if (toBeSent) {
            $.post({
                url: '/validate',
                data: toBeSent,
                success: data => {
                    resultDiv.empty();
                    resultDiv.append(`<p>${data}</p>`)
                },
                error: e => {
                    alert(e.responseText);
                },
                contentType: 'text/plain'
            });
        }
    });

    clearBtn.click(() => {
        resultDiv.empty();
        textArea.val(null);
        fileUploader.val('');
        fileContent = null;
        decoded = null;
    });
});
