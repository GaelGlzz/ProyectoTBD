const modalElement = document.getElementById('customModal');
const modalMessage = document.getElementById('modalMessage');
const modalOkBtn = document.getElementById('modalOkBtn');
const modalCancelBtn = document.getElementById('modalCancelBtn');
const modalTitle = document.getElementById('modalTitle');
    let confirmCallback = null;
        export function customAlert(message, title = 'Notificación') {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modalOkBtn.textContent = 'Aceptar';
            modalCancelBtn.style.display = 'none';

            modalOkBtn.onclick = () => {
                modalElement.style.display = 'none';
                modalOkBtn.onclick = null;
            };

            modalElement.style.display = 'flex';
        }

        export function customConfirm(message, callback, title = 'Confirmación Requerida') {
            modalTitle.textContent = title;
            modalMessage.textContent = message;
            modalOkBtn.textContent = 'Aceptar';
            modalCancelBtn.style.display = 'inline-flex'; 
            confirmCallback = callback;

            modalOkBtn.onclick = () => {
                modalElement.style.display = 'none';
                if (confirmCallback) {
                    confirmCallback(true);
                }
                confirmCallback = null;
            };

            modalCancelBtn.onclick = () => {
                modalElement.style.display = 'none';
                if (confirmCallback) {
                    confirmCallback(false);
                }
                confirmCallback = null;
            };

            modalElement.style.display = 'flex'; 
        }