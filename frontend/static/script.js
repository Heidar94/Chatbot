document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const resetBtn = document.getElementById('resetBtn');

    // Función para agregar un mensaje al chat
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para mostrar indicador de escritura
    function showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Función para eliminar el indicador de escritura
    function removeTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Función para enviar mensaje
    async function sendMessage() {
        const message = userInput.value.trim();
        if (!message) return;

        // Agregar mensaje del usuario
        addMessage(message, true);
        userInput.value = '';
        userInput.focus();

        // Mostrar indicador de escritura
        showTypingIndicator();

        try {
            // Enviar mensaje al servidor
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: message })
            });

            const data = await response.json();
            
            // Eliminar indicador de escritura
            removeTypingIndicator();

            // Mostrar respuesta del bot
            if (data.response) {
                typeWriterEffect(data.response);
            } else {
                addMessage('Lo siento, hubo un error al procesar tu mensaje.', false);
            }
        } catch (error) {
            removeTypingIndicator();
            addMessage('Error de conexión con el servidor', false);
            console.error('Error:', error);
        }
    }

    // Función para efecto de escritura
    function typeWriterEffect(text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        chatMessages.appendChild(messageDiv);
        
        let i = 0;
        const speed = 10; // Velocidad de escritura (ms)
        
        function type() {
            if (i < text.length) {
                messageDiv.textContent += text.charAt(i);
                i++;
                chatMessages.scrollTop = chatMessages.scrollHeight;
                setTimeout(type, speed);
            }
        }
        
        type();
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    resetBtn.addEventListener('click', async function() {
        if (confirm('¿Estás seguro de que quieres comenzar una nueva conversación?')) {
            try {
                await fetch('http://localhost:8000/reset', {
                    method: 'POST'
                });
                chatMessages.innerHTML = '';
                addMessage('¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?', false);
            } catch (error) {
                console.error('Error al reiniciar la conversación:', error);
            }
        }
    });

    // Mensaje de bienvenida
    addMessage('¡Hola! Soy tu asistente de IA. ¿En qué puedo ayudarte hoy?', false);
});