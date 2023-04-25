
import './App.css';
import React from 'react';
import questions from './quiz_questions.json'
import { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'; //toast notification 
import 'react-toastify/dist/ReactToastify.css';

function App() {
	return (
		<div className="App">
			<div>
			</div>
			<header className="App-header">
				<p>Kvíz: kovy</p>
			</header>
			<Quiz />
		</div>
	)
}

function Quiz() {
	const [quizStatus, setQuizStatus] = useState('start') // 3 possible options: start, play, end
	const [taskNum, setTaskNum] = useState(-1)
	const [task, setTask] = useState(questions.Questions[taskNum])
	const [history, setHistory] = useState([]) // history of solved tasks, contains given answers and right ones
	const [clickEnabled, setClickEnabled] = useState(true) // disable click while toast is active 

	async function handleAnswerClick(e) { // answer button click handler, contains delay function
		function timeout(delay) {
			return new Promise(res => setTimeout(res, delay))
		}

		if (clickEnabled) {
			setClickEnabled(false) // when clicked disables clicks to prevent multiple clicks

			setHistory([...history, [task['Id'], task['Right answer'], e.target.id]])

			e.target.id === task['Right answer'] ? // show the notification toast
				toast.success('Správně', { autoClose: 500, position: "top-center" }) :
				toast.error('Špatně', { autoClose: 500, position: "top-center" })

			await timeout(1500) // waiting for the toast

			// next task or end game
			taskNum !== questions.Questions.length - 1 ? nextTask() : setQuizStatus('end')

			setClickEnabled(true)

		}
	}

	function handleStartBtnClick() {
		nextTask()
		setQuizStatus('play')
	}

	function handleTryAgainClick() {
		setQuizStatus('start')
		setTaskNum(-1)
		setHistory([])
	}

	function nextTask() {
		setTaskNum(taskNum + 1)
		setTask(questions.Questions[taskNum + 1])
	}

	if (quizStatus === 'start') {
		return (
			<QuizStart
				onStartBtnClick={handleStartBtnClick}
			/>
		)
	}
	else if (quizStatus === 'play') {
		return (
			<div>
				<ToastContainer />
				<QuizTask
					task={task}
					handleAnswerClick={handleAnswerClick}
				/>
			</div>
		)
	}
	else if (quizStatus === 'end') {
		return (
			<div className="Statistics">
				<Statistics
					history={history} />
				<TryAgainBtn
					onTryAgainClick={handleTryAgainClick} />
			</div>
		)
	}
}

function QuizStart({ onStartBtnClick }) {
	return (
		<div className="Start">
			<p>Vítejte u kvízu na téma: kovy. Kvíz se skladá ze 6 otázek,
				u každé musíte uhodnout, o jaký kov se jedná,
				a zvolit jednu ze 4 možností. Na konci kvízu se Vám zobrazí Vaše výsledky.</p>
			<div className="Start-button Button" onClick={onStartBtnClick}>Začít kvíz</div>
		</div>
	)
}

function QuizTask({ task, handleAnswerClick }) {
	return (
		<div className="Quiz">
			<img src={task['Image source']} alt=''></img>
			<p>
				{task['Question']}
			</p>
			<PrintAnswers
				answers={task['Answers']}
				onAnswerClick={handleAnswerClick}
			/>
		</div>)
}

function PrintAnswers({ answers, onAnswerClick }) {
	const answerList = []
	for (let i = 0; i < answers.length; i++) {
		answerList.push(
			<div id={answers[i]} className='AnswerList-item Button' onClick={onAnswerClick}>
				{answers[i]}
			</div>
		)
	}
	return (
		<div className='AnswerList'>
			{answerList}
		</div>
	)
}

function Statistics({ history }) {
	const statList = []
	let countCorret = 0
	let answerWordForm = ""
	let result = ""


	// to show statistics going through history array
	for (let i = 0; i < history.length; i++) {
		let answerCorrectness = ""
		if (history[i][1] === history[i][2]) { // compare the given answer and the right one
			answerCorrectness = "Correct"      // give class name which will show right/bad answer with color
			countCorret += 1
		}
		else {
			answerCorrectness = "Incorrect"
		}
		statList.push(
			<div className="Statistics-row">
				<p>{history[i][0] + 1}</p>
				<p>{history[i][1]}</p>
				<p className={answerCorrectness}>{history[i][2]}</p>
			</div>
		)
	}

	// handle differen forms of "question" in cz language depending on number
	// also choose the result message 
	if (countCorret === 0) {
		answerWordForm = "otázek"
		result = "Jejda! Zkus to znovu!"
	}
	else if (countCorret === 1) {
		answerWordForm = "otázku"
		result = "Jejda! Zkus to znovu!"
	}
	else if (countCorret > 1 & countCorret < 5) {
		answerWordForm = "otázky"
		result = "Celkem dobře, ale můžeš zkusit ještě jednou!"
	}
	else if (countCorret >= 5) {
		answerWordForm = "otázek"
		result = "Výborně! Jsi odborník/ice na kovy!"
	}


	return (
		<div>
			<p>{result}</p>
			<p>Spřávně jsi zodpověděl/a {countCorret} {answerWordForm} z {history.length}</p>
			<div className="Statistics-row">
				<p>Číslo otázky</p>
				<p>Správná odpověď</p>
				<p>Tvoje odpověď</p>
			</div>
			{statList}
		</div>
	)
}

function TryAgainBtn({ onTryAgainClick }) {
	return (
		<div className="Button" onClick={onTryAgainClick}>
			Zkusit znovu!
		</div>
	)
}


export default App;
