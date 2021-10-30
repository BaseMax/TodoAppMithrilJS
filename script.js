const globalState = {
	todos: [],
	editing: undefined,
	todoInput: "",
	todoCategory: "RED",
}

const globalAction = {
	changeTodo: (value) => {
		globalState.todos = value
	},
	deleteTodo: (index) => {
		console.log(`delete ${index}`)
		delete globalState.todos[index]
		// globalState.todos.splice(index, 1)
		globalAction.saveCache()
	},
	saveCache() {
		const tmp = JSON.stringify(globalState.todos)
		console.log(`Save cache ${tmp}`)
		localStorage.setItem("todos", tmp)
	},
	loadCache() {
		const tmp = localStorage.getItem("todos");
		if(tmp !== null) {
			console.log(`Load cache ${tmp}`)
			const arr = JSON.parse(tmp)
			if(arr instanceof Array) {
				globalState.todos = arr.filter((x) => x !== null)
				this.saveCache()
				console.log(`Set state todos = `, globalState.todos)
			}
		}
	},
}

class HeaderComponent {
	constructor(vnode) {

	}
	oncreate() {
		
	}
	view() {
		return m("header", {class:"header", style:{"border-bottom-color":"var(--textColor)"}},
			[
				m("svg", {class:"header__icon header__icon--mode", "stroke":"currentColor", "fill":"currentColor", "stroke-width":"0", "viewBox":"0 0 24 24", "height":"1em", "width":"1em", "xmlns":"http://www.w3.org/2000/svg"}, 
					m("path", {"d":"M20.742,13.045c-0.677,0.18-1.376,0.271-2.077,0.271c-2.135,0-4.14-0.83-5.646-2.336c-2.008-2.008-2.799-4.967-2.064-7.723 c0.092-0.345-0.007-0.713-0.259-0.965C10.444,2.04,10.077,1.938,9.73,2.034C8.028,2.489,6.476,3.382,5.241,4.616 c-3.898,3.898-3.898,10.243,0,14.143c1.889,1.889,4.401,2.93,7.072,2.93c2.671,0,5.182-1.04,7.07-2.929 c1.236-1.237,2.13-2.791,2.583-4.491c0.092-0.345-0.008-0.713-0.26-0.965C21.454,13.051,21.085,12.951,20.742,13.045z M17.97,17.346c-1.511,1.511-3.52,2.343-5.656,2.343c-2.137,0-4.146-0.833-5.658-2.344c-3.118-3.119-3.118-8.195,0-11.314 c0.602-0.602,1.298-1.102,2.06-1.483c-0.222,2.885,0.814,5.772,2.89,7.848c2.068,2.069,4.927,3.12,7.848,2.891 C19.072,16.046,18.571,16.743,17.97,17.346z"})
				),
				m("h1", {class:"header__logo"}, 
					m("img", {"src":"asset/logo.png", "width":"140", "alt":""})
				),
				m("p", {class:"header__text", style:{"color":"var(--textColor)"}}, 
					"HeyBug Todo App"
				)
			]
		)
	}
}

class FooterComponent {
	constructor(vnode) {
		// value = ""
		// category = "RED"
		// this.loadCache()
	}
	oncreate() {
		
	}
	setInput(value) {
		globalState.todoInput = value
		console.log(`Set value = ${globalState.todoInput}`)
	}
	changeCategory(e) {
		globalState.todoCategory = e.target.getAttribute('value')
		console.log(`Set category = ${globalState.todoCategory}`)
	}
	handleInput(e) {
		// if(e.keyCode === 13)
		// 	this.add()
		// else
			this.setInput(e.target.value)
	}
	add() {
		globalState.todoInput = globalState.todoInput.trim();
		if(globalState.todoInput === "") {
			return;
		}
		console.log(`Add todo(${globalState.todoInput}, ${globalState.todoCategory})`)
	
		const newValue = {
			value: globalState.todoInput,
			category: globalState.todoCategory
		}

		if(globalState.editing === undefined) {
			globalState.todos.push(newValue)
		} else if(globalState.todos[globalState.editing]) {
			console.log(globalState.editing, newValue)
			globalState.todos[globalState.editing] = newValue
			globalState.editing = undefined
		}
		this.setInput("")
		globalAction.saveCache()
	}
	view() {
		// this.loadCache()
		return m("footer", {class:"footer"}, 
			m("form", {name: "todos", class:"footer__wrapper", "data-action":"add", onsubmit: (e) => {
				e.preventDefault()
				// this.setInput(document.forms.todos.todo.value)
				this.add()
			}},
				[
					m("div", {class:"form-box"},
						[
							m("input", {
								name: "todo",
								class:"form-box__input", 
								type:"text", 
								placeholder:"add todo...", 
								oninput: this.handleInput.bind(this),
								// onkeyup: (e) => { this.handleInput(e) },
								value: globalState.todoInput,

							}),
							m("button", {class:"form-box__btn", type:"submit"},
								globalState.editing === undefined ? "Add" : "Update"
							)
						]
					),
					m("div", {class:"colors"},
						[
							m("div", {class:"color"},
								[
									m("input", {
										class:"color__radio",
										type:"radio",
										id:"red",
										name:"category",
										checked: globalState.todoCategory === "RED",
										value:"RED",
										onchange: this.changeCategory.bind(this)
									}),
									m("span", {class:"checked"}),
									m("label", {class:"color__label red", "for":"red"})
								]
							),
							m("div", {class:"color"},
								[
									m("input", {
										class:"color__radio",
										type:"radio",
										id:"blue",
										name:"category",
										checked: globalState.todoCategory === "BLUE",
										value:"BLUE",
										onchange: this.changeCategory.bind(this)
									}),
									m("span", {class:"checked"}),
									m("label", {class:"color__label blue", "for":"blue"})
								]
							),
							m("div", {class:"color"},
								[
									m("input", {
										class:"color__radio",
										type:"radio",
										id:"green",
										name:"category",
										checked: globalState.todoCategory === "GREEN",
										value:"GREEN",
										onchange: this.changeCategory.bind(this)
									}),
									m("span", {class:"checked"}),
									m("label", {class:"color__label green", "for":"green"})
								]
							)
						]
					)
				]
			)
		)
	} // end view
}

class TodoItem {
	constructor(vnode) {
		this.mappingCategory = {
			RED: 'red',
			BLUE: 'blue',
			GREEN: 'green',
		}
		// this.todo = vnode.attrs.todo
	}
	oncreate() {

	}
	view(vnode) {
		const todo = {
			...globalState.todos[vnode.attrs.todo.index],
			index: vnode.attrs.todo.index
		}
		return m("div", {class:"todo"},
			[
				m("span", {class:"category "+ this.mappingCategory[todo.category], style:{}}),
				m("p", {class:"todo__text", "data-action":"checked", style:{"color":"var(--textColor)"}},
					[
						todo.value, 
						m("span", {class:"line", style:{"width":"0%"}})
					]
				),
				m("div", {class:"settings"},
					[
						m("svg", {class:"settings__icon", "stroke":"currentColor", "fill":"currentColor", "stroke-width":"0", "viewBox":"0 0 24 24", "data-action":"edit", "height":"1em", "width":"1em", "xmlns":"http://www.w3.org/2000/svg",
							onclick: () => {
								console.log("edit:", todo)
								if(globalState.editing !== undefined && globalState.editing === todo.index) {
									globalState.editing = undefined
									globalState.todoInput = ""
								} else {
									globalState.editing = todo.index
									globalState.todoInput = todo.value
									globalState.todoCategory = todo.category
								}
							}
						},
							[
								m("path", {"d":"M7,17.013l4.413-0.015l9.632-9.54c0.378-0.378,0.586-0.88,0.586-1.414s-0.208-1.036-0.586-1.414l-1.586-1.586\tc-0.756-0.756-2.075-0.752-2.825-0.003L7,12.583V17.013z M18.045,4.458l1.589,1.583l-1.597,1.582l-1.586-1.585L18.045,4.458z M9,13.417l6.03-5.973l1.586,1.586l-6.029,5.971L9,15.006V13.417z"}),
								m("path", {"d":"M5,21h14c1.103,0,2-0.897,2-2v-8.668l-2,2V19H8.158c-0.026,0-0.053,0.01-0.079,0.01c-0.033,0-0.066-0.009-0.1-0.01H5V5\th6.847l2-2H5C3.897,3,3,3.897,3,5v14C3,20.103,3.897,21,5,21z"})
							]
						),
						m("svg", {class:"settings__icon", "stroke":"currentColor", "fill":"currentColor", "stroke-width":"0", "viewBox":"0 0 24 24", "data-action":"delete", "height":"1em", "width":"1em", "xmlns":"http://www.w3.org/2000/svg",
							onclick: () => globalAction.deleteTodo(todo.index)
						}, 
							m("path", {"d":"M15,2H9C7.897,2,7,2.897,7,4v2H3v2h2v12c0,1.103,0.897,2,2,2h10c1.103,0,2-0.897,2-2V8h2V6h-4V4C17,2.897,16.103,2,15,2z M9,4h6v2H9V4z M17,20H7V8h1h8h1V20z"})
						)
					]
				)
			]
		)
	}
}

class MainComponent {
	constructor(vnode) {
	}
	oncreate() {

	}
	view() {
		return m("main", {class:"main", style:{"height":"280px"}}, 
			m("div", {class:"todos"},
				globalState.todos.filter((x) => x !== null).length === 0 ?
					[
						m("div", {class:"empty"},
							[
								m("img", {"width":"200", "src":"asset/light.png", "alt":""}),
								m("h2", 
									"Your to-do list is empty."
								),
								m("p", 
									"Please create a new task"
								)
							]
						),
					]
					: globalState.todos.map((todo, index) => {
						return m(TodoItem, {
							todo: {
								index: index,
								...todo
							},
						})
					})
			)
		)
	}
}

class ThemeComponent {
	constructor() {

	}
	oncreate() {

	}
	view() {
		return m("div", 
			m("div", {class:"helper-layout-moon", style:{"transform":"scale(1)"}})
		)
	}
}

class ContainerComponent {
	view({children}) {
		return m("div", {class:"container"},
			children
		)
	}
}

// const Parent = m("div", {class:"app"}, 
// 	m(ContainerComponent, [
// 		m(ThemeComponent),
// 		m(HeaderComponent),
// 		m(MainComponent),
// 		m(FooterComponent)
// 	])
// )
// m.render(root, Parent)

// m.mount(document.body, {
// 	view : () => m('.app',
// 	  m(ContainerComponent, [
// 			m(ThemeComponent),
// 			m(HeaderComponent),
// 			m(MainComponent),
// 			m(FooterComponent)
// 		])
// 	)
// })

class Page {
	constructor() {
		globalAction.loadCache()
	}
	view() {
		return m("div", {class:"app"}, 
			m(ContainerComponent, [
				m(ThemeComponent),
				m(HeaderComponent),
				m(MainComponent),
				m(FooterComponent),
			])
		)
	}
}
m.mount(document.body, Page)
