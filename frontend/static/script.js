document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('userInput');
    const sendBtn = document.getElementById('sendBtn');
    const resetBtn = document.getElementById('resetBtn');

    let abortController = null;
    let isGenerating = false;

    // Función para agregar un mensaje al chat
    function addMessage(content, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
        // Convertir Markdown a HTML
        const formattedContent = marked.parse(content);
        messageDiv.innerHTML = formattedContent;
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

        abortController = new AbortController();
        isGenerating = true;
        updateUIForGenerating(true);

        try {
            // Enviar mensaje al servidor
            const response = await fetch('http://localhost:8000/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: message }),
                signal: abortController.signal
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
            if (error.name === 'AbortError') {
                console.error('Generación abortada');
                addMessage('Generación abortada por el usuario', false);
            } else {
                
                addMessage('Error de conexión con el servidor', false);
                console.error('Error:', error);
            }
        } finally {
            removeTypingIndicator();
            isGenerating = false;
            updateUIForGenerating(false);
            abortController = null;
        }
    }

    // Función para detener la generación
    function stopGeneration() {
        if (abortController) {
            abortController.abort();
        }
    }

    // Función para actualizar la UI según el estado de generación
    function updateUIForGenerating(isGenerating) {
        const stopBtn = document.getElementById('stopBtn');
        const sendBtn = document.getElementById('sendBtn');
        
        stopBtn.style.display = isGenerating ? 'flex' : 'none';
        sendBtn.disabled = isGenerating;
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
            } else {
                // Cuando termine de escribir, aplicar el formato Markdown
                applyMarkdownFormatting(messageDiv);
            }
        }
        
        type();
    }

    // Configurar marked para resaltado de sintaxis
    marked.setOptions({
        highlight: function(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
        langPrefix: 'hljs language-',
    });

    // Función para aplicar formato Markdown después de mostrar el texto
    function applyMarkdownFormatting(element) {
        setTimeout(() => {
            const markdownText = element.textContent;
            element.innerHTML = marked.parse(markdownText);
            
            // Añadir botones de copia a los bloques de código
            document.querySelectorAll('pre code').forEach((block) => {
                // Crear contenedor para el bloque de código
                const container = document.createElement('div');
                container.className = 'code-block-container';
                
                // Crear barra de herramientas
                const toolbar = document.createElement('div');
                toolbar.className = 'code-toolbar';
                
                // Añadir botón de copiar
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-button';
                copyButton.title = 'Copiar al portapapeles';
                copyButton.innerHTML = '<i class="far fa-copy"></i>';
                
                // Obtener el lenguaje del bloque de código
                const language = Array.from(block.classList)
                    .find(cls => cls.startsWith('language-'))
                    ?.replace('language-', '') || 'text';
                
                // Añadir etiqueta de lenguaje
                const langLabel = document.createElement('span');
                langLabel.className = 'language-label';
                langLabel.textContent = language;
                
                // Construir la estructura
                toolbar.appendChild(langLabel);
                toolbar.appendChild(copyButton);
                
                // Envolver el bloque de código original
                const wrapper = block.parentNode;
                wrapper.parentNode.insertBefore(container, wrapper);
                container.appendChild(toolbar);
                container.appendChild(wrapper);
                
                // Añadir funcionalidad de copiado
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(block.textContent).then(() => {
                        // Cambiar temporalmente el ícono para indicar que se copió
                        const icon = copyButton.querySelector('i');
                        const originalIcon = icon.className;
                        icon.className = 'fas fa-check';
                        copyButton.title = '¡Copiado!';
                        
                        setTimeout(() => {
                            icon.className = originalIcon;
                            copyButton.title = 'Copiar al portapapeles';
                        }, 2000);
                    });
                });
            });
            
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 300);
    }

    // Event Listeners
    sendBtn.addEventListener('click', sendMessage);
    stopBtn.addEventListener('click', stopGeneration);
    
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