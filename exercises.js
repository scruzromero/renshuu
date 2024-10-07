fetch('db/exercises.json')
    .then(response => response.json())
    .then(data => {
        window.data = data;

        let currentExerciseIndex = 0;
        let currentQuestionIndex = 0;
        let score = 0;
        let ejercicio;
        let ejercicioSession = [];
    
        const breadcrumbDIV = document.getElementById('breadcrumb');
        const navigationIndicatorDIV = document.getElementById('navigationIndicator');
        const questionsDIV = document.getElementById('questions');
        const answersDIV = document.getElementById('answers');
        const nextQuestionDIV = document.getElementById('nextQuestion');
        const questionsTag = document.getElementById('questionsTag');
        const windowDecorDIV = document.getElementById('decoration');

        function showStartScreen() {
            const startScreenDIV = document.getElementById('startScreen');
            startScreenDIV.innerHTML = '';

            // Decoración de la ventana
            const windowDecor = document.createElement('div');
            windowDecor.classList.add("windowDecor");
            startScreenDIV.appendChild(windowDecor);

            const windowStartTitle = document.createElement('div');
            windowDecor.appendChild(windowStartTitle);

            const windowStartTitleIcon = document.createElement('i');
            windowStartTitleIcon.classList.add("fa-sharp", "fa-solid", "fa-book", "windowStartTitleIcon");
            windowStartTitle.appendChild(windowStartTitleIcon);

            const windowStartTitleText = document.createElement ('span');
            windowStartTitleText.textContent = 'DOKKAI';
            windowStartTitleText.classList.add("windowStartTitle");
            windowStartTitle.appendChild(windowStartTitleText);

            const windowCloseItem = document.createElement('i');
            windowCloseItem.classList.add("fa-sharp", "fa-solid", "fa-xmark", "windowCloseIcon");
            windowDecor.appendChild(windowCloseItem);

            // Instrucciones o descripción
            const description = document.createElement('p');
            description.textContent = 'Selecciona la dificultad y el nivel para comenzar tu sesión de estudio.';
            description.classList.add("instrucciones");
            description.classList.add("startScreenText");
            startScreenDIV.appendChild(description);
        
            // Selección de dificultad
            const difficultySelector = document.createElement('div');
            startScreenDIV.appendChild(difficultySelector);

            const difficultyLabel = document.createElement('label');
            difficultyLabel.classList.add('startScreenLabel');
            difficultyLabel.textContent = 'Dificultad: ';
            difficultySelector.appendChild(difficultyLabel);
        
            const difficultySelect = document.createElement('select');
            difficultySelect.id = 'difficultySelect';
            const difficulties = ['⭐', '⭐⭐', '⭐⭐⭐'];
            difficulties.forEach(diff => {
                const option = document.createElement('option');
                option.value = diff;
                option.textContent = diff;
                difficultySelect.appendChild(option);
            });
            difficultySelector.appendChild(difficultySelect);
        
            // Selección de nivel JLPT
            const levelSelector = document.createElement('div');
            levelSelector.id = "levelSelector";
            startScreenDIV.appendChild(levelSelector);

            const levelLabel = document.createElement('label');
            levelLabel.classList.add('startScreenLabel');
            levelLabel.textContent = ' Nivel JLPT: ';
            levelSelector.appendChild(levelLabel);
        
            const levelSelect = document.createElement('select');
            levelSelect.id = 'levelSelect';
            const levels = ['N5', 'N4', 'N3', 'N2', 'N1'];
            levels.forEach(level => {
                const option = document.createElement('option');
                option.value = level;
                option.textContent = level;
                levelSelect.appendChild(option);
            });
            levelSelector.appendChild(levelSelect);
        
            // Botón para comenzar
            const startButton = document.createElement('button');
            startButton.textContent = 'Comenzar Sesión';
            startButton.classList.add('startButton');
            startButton.onclick = () => {
                const selectedDifficulty = difficultySelect.value;
                const selectedLevel = levelSelect.value;
                startStudySession(selectedDifficulty, selectedLevel);
            };
            startScreenDIV.appendChild(startButton);
        }

        function startStudySession(selectedDifficulty, selectedLevel) {
            // Filtrar ejercicios según dificultad y nivel
            ejercicioSession = window.data.ejercicios.filter(ejercicio => {
                return ejercicio.dificultad === selectedDifficulty && ejercicio['nivel JLPT'] === selectedLevel;
            });
        
            if (ejercicioSession.length === 0) {
                alert('No se encontraron ejercicios con los criterios seleccionados.');
                return;
            }
        
            // Inicializar variables de la sesión
            currentExerciseIndex = 0;
            currentQuestionIndex = 0;
            score = 0;
            ejercicio = ejercicioSession[currentExerciseIndex];
        
            // Ocultar pantalla de inicio y mostrar contenido principal
            document.getElementById('startScreen').style.display = 'none';
            document.querySelector('.mainPort').style.display = 'block';
        
            // Mostrar el primer ejercicio
            showReadingScreen();
        }

        function showBreadcrumb() {
            breadcrumbDIV.innerHTML = `${ejercicio.dificultad} | ${ejercicio.capitulo}`;
        }

        function showNavigationIndicator() {
            const preguntaNumero = ejercicio.preguntas[currentQuestionIndex].numero;
            const totalPreguntas = ejercicio.preguntas.length;
            navigationIndicatorDIV.innerHTML = `Ejercicio ${currentExerciseIndex + 1} de ${ejercicioSession.length} / Pregunta ${preguntaNumero} de ${totalPreguntas}`;
        }

        function showReadingScreen() {
            questionsTag.style.display = 'none';
            document.getElementById('navigation').style.display = 'none';
            document.getElementById('answers').style.display = 'none';

            questionsDIV.innerHTML = '';
            answersDIV.innerHTML = '';
            nextQuestionDIV.innerHTML = '';
            windowDecorDIV.innerHTML = '';

            const windowDecor = document.createElement('div');
            windowDecor.classList.add("windowDecor");
            windowDecorDIV.appendChild(windowDecor);

            const windowStartTitle = document.createElement('div');
            windowDecor.appendChild(windowStartTitle);
            
            const windowStartTitleIcon = document.createElement('i');
            windowStartTitleIcon.classList.add("fa-sharp", "fa-solid", "fa-book", "windowStartTitleIcon");
            windowStartTitle.appendChild(windowStartTitleIcon);
            
            const windowStartTitleText = document.createElement ('span');
            windowStartTitleText.textContent = 'DOKKAI';
            windowStartTitleText.classList.add("windowStartTitle");
            windowStartTitle.appendChild(windowStartTitleText);
            
            const windowCloseItem = document.createElement('i');
            windowCloseItem.classList.add("fa-sharp", "fa-solid", "fa-xmark", "windowCloseIcon");
            windowDecor.appendChild(windowCloseItem);

            const instruccionesElement = document.createElement('p');
            instruccionesElement.textContent = 'Lee el siguiente texto atentamente antes de responder las preguntas.';
            instruccionesElement.classList.add('instruccionesLectura');
            questionsDIV.appendChild(instruccionesElement);

            const textoElement = document.createElement('p');
            textoElement.textContent = ejercicio.texto;
            textoElement.classList.add('textoEjercicio');
            questionsDIV.appendChild(textoElement);

            const startButton = document.createElement('button');
            startButton.textContent = 'Comenzar preguntas de comprensión';
            startButton.classList.add('startButton');
            startButton.onclick = () => {
                currentQuestionIndex = 0;
                showBreadcrumb();
                showNavigationIndicator();

                document.getElementById('navigation').style.display = 'block';
                document.getElementById('answers').style.display = 'grid';

                showQuestionsScreen();
            };
            nextQuestionDIV.appendChild(startButton);
        }

        function showQuestionsScreen() {
            questionsTag.style.display = 'block';
            questionsDIV.appendChild(questionsTag);

            const instruccionesElement = document.querySelector('.instruccionesLectura');
            if (instruccionesElement) instruccionesElement.remove();

            const textoLecturaElement = document.querySelector('.textoEjercicio');
            if (textoLecturaElement) 
                textoLecturaElement.style.color = "grey";
                textoLecturaElement.style.fontSize = "1rem";
                textoLecturaElement.style.marginBottom = "1.5rem";
                textoLecturaElement.style.marginLeft = "3%";
                textoLecturaElement.style.marginRight = "3%";
                textoLecturaElement.style.textAlign = "center";

            nextQuestionDIV.innerHTML = '';
            showQuestion();
        }

        function showQuestion() {
            answersDIV.innerHTML = '';

            const previousQuestion = document.querySelector('.preguntaTexto');
            if (previousQuestion) previousQuestion.remove();

            const nuevaPregunta = document.createElement('p');
            nuevaPregunta.textContent = ejercicio.preguntas[currentQuestionIndex].pregunta;
            nuevaPregunta.classList.add('preguntaTexto');
            questionsDIV.appendChild(nuevaPregunta);

            ejercicio.preguntas[currentQuestionIndex].opciones.forEach(opcion => {
                const opcionElement = document.createElement('button');
                opcionElement.textContent = opcion;
                opcionElement.classList.add('opcion');

                opcionElement.onclick = () => {
                    if (opcion === ejercicio.preguntas[currentQuestionIndex].respuesta_correcta) {
                        score++;
                        mostrarAlerta({
                            mensaje: "¡Correcto!",
                            callback: nextQuestion
                        });
                    } else {
                        mostrarAlerta({
                            mensaje: "Incorrecto",
                            callback: nextQuestion
                        });
                    }
                };

                answersDIV.appendChild(opcionElement);
            });

            showNavigationIndicator();
        }

        function nextQuestion() {
            currentQuestionIndex++;
            if (currentQuestionIndex < ejercicio.preguntas.length) {
                showQuestion();
            } else {
                currentExerciseIndex++;
                if (currentExerciseIndex < ejercicioSession.length) {
                    mostrarAlerta({
                        mensaje: `Has terminado el ejercicio ${currentExerciseIndex}`,
                        textoBoton: 'Siguiente ejercicio',
                        mostrarBotonSiguiente: true,
                        callback: () => {
                            currentQuestionIndex = 0;
                            ejercicio = ejercicioSession[currentExerciseIndex];
                            showReadingScreen();
                        }
                    });
                } else {
                    mostrarAlerta({
                        mensaje: "¡Has completado todos los ejercicios!",
                        puntajeFinal: `Tuviste ${score} respuestas acertadas.`,
                        callback: () => {
                            // Acciones al finalizar todos los ejercicios
                            reiniciarSesion();
                        }
                    });
                }
            }
        } 
        
        function reiniciarSesion() {
            // Reiniciar variables
            currentExerciseIndex = 0;
            currentQuestionIndex = 0;
            score = 0;
            ejercicio = null;
            ejercicioSession = [];
        
            // Mostrar pantalla de inicio
            document.getElementById('startScreen').style.display = 'block';
            document.querySelector('.mainPort').style.display = 'none';
        
            // Reiniciar pantalla de inicio si es necesario
            showStartScreen();
        }

        showStartScreen();
    })
    .catch(error => {
        console.error('Error al cargar el archivo JSON:', error);
    });