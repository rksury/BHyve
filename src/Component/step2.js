import React, {Component} from 'react';
import API from "../Services/API";


class Step2 extends Component {

    api = new API()

    constructor(props) {
        super(props);
        this.state = {
            skills: [],
            selected_skills: [],
            submit_disable: false,
            isLoading: false,
            currentPage: 1,
            todosPerPage: 10,
            todos: [],
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleClick = this.handleClick.bind(this);

        this.skill_event()
    }

    handleClick(event) {
        let getClassName = document.getElementsByClassName("pageList");
        for (let i = 1; i<=getClassName.length; i++){
            document.getElementById(i).style.background = "#aaaaaa";
        }
        document.getElementById(event.target.id).style.background = "#a64bf4";
        this.setState({
            currentPage: Number(event.target.id)
        });
    }

    onChangePage(skills) {
        this.setState({skills: skills});
    }

    skill_event() {
        let url = 'skills'
        this.api.GetApi(url)
            .then(res => {
                if (res.request.status === 200) {
                    let response_data = JSON.parse(res.request.response)
                    this.setState({
                        skills: response_data,
                        isLoading: true
                    })
                    const list_data = [];
                    for (let i = 0; i <= (response_data).length - 1; i++) {
                        list_data.push(response_data[i]['skillName'])
                    }
                    this.setState({
                        todos: list_data
                    })


                } else {
                    let err = JSON.parse(res.request.response)
                    console.log(res.request.status)
                    window.alert(err['message'])
                }
            }).catch(error => {
            console.log(error)
            window.alert('Connection error try again letter')
        });
    }

    handleInputChange(event) {
        let target = event.target;
        let value = target.value;

        if (target.checked) {
            this.setState({
                selected_skills: this.state.selected_skills.concat(value)
            }, this.count_input)
        } else {
            const index = (this.state.selected_skills).indexOf(value);
            if (index > -1) {
                (this.state.selected_skills).splice(index, 1);
                this.count_input()
            }

        }

    }

    count_input() {
        let options = this.state.selected_skills
        if (options.length >= 3 && options.length <= 8) {
            this.setState({
                submit_disable: true
            })

        } else {
            this.setState({
                submit_disable: false
            })
        }

    }

    submit() {

        let data = {
            skills: this.state.selected_skills,
        }

        let url = 'user/skills'

        this.api.AuthPostApi(data, url)
            .then(res => {
                if (res.request.status === 201) {
                    this.props.history.push('/dashboard')
                    alert("Add skills Successfully")
                } else if (res.request.status === 401) {
                    this.props.history.push('/signin')
                } else {
                    let err = JSON.parse(res.request.response)
                    window.alert(err['message'])
                }
            }).catch(error => {
                console.error(error)
        });


    }


    render() {
        const todos = this.state.todos
        const currentPage = this.state.currentPage
        const todosPerPage = this.state.todosPerPage
        const indexOfLastTodo = currentPage * todosPerPage;
        const indexOfFirstTodo = indexOfLastTodo - todosPerPage;
        const currentTodos = todos.slice(indexOfFirstTodo, indexOfLastTodo);

        const renderTodos = currentTodos.map((todo, index) => {
            return <>
                        <span className="singleSkill">
                    <input type="checkbox" value={todo}
                           key={todo}
                           id={todo.slice(-6, -1)}
                           onChange={this.handleInputChange}/>
                    <span className="skillValue">
                    {todo}
                    </span>
                </span>
            </>;
        });

        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(todos.length / todosPerPage); i++) {
            pageNumbers.push(i);
        }



        const isSubmit = this.state.submit_disable;
        const isLoading = this.state.isLoading;

        const renderPageNumbers = pageNumbers.map(number => {
            return (
                <li className="pageList"
                    key={number}
                    id={number}
                    onClick={this.handleClick}
                >
                    {number}
                </li>
            );
        });


        return (
            <>

                {isLoading ? (
                    <div className={"container"}>
                        <div className={"row"}>
                            <div className={"col-md-12"}>
                                <div className="limiter">
                                    <div className="container-login100 ">
                                        <div className="wrap-login100  custom_body">

                                            <div className="login100-form validate-form ">
                                                <span className="login100-form-title ">Select Skills</span>
                                                <div className="custom_height">
                                                    {renderTodos}
                                                </div>

                                                <div className="container-login100-form-btn">
                                                    {renderPageNumbers}
                                                    <div className="wrap-login100-form-btn">
                                                        <div className="login100-form-bgbtn"/>
                                                        {isSubmit ? (
                                                            <button type={"submit"} onClick={() => this.submit()}
                                                                    className="login100-form-btn">Submit
                                                            </button>
                                                        ) : (

                                                            <button type={"submit"}
                                                                    className="login100-form-btn bg-disabled">Submit
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>

                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : ('')}
            </>
        );
    }
}

export default Step2;