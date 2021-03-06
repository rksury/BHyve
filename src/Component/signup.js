import React, {Component} from 'react';
import API from "../Services/API";

class Signup extends Component {
    api = new API()

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',

            form_errors: {
                username: null,
                password: null,
            }
        }

        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.signup_event = this.signup_event.bind(this);


    }

    usernameChangeHandler(event) {

        this.setState({username: event.target.value});
        this.resetFormErrors('username')
    }

    passwordChangeHandler(event) {
        this.setState({password: event.target.value});
        this.resetFormErrors('password')


    }

    resetFormErrors(input_to_reset) {
        let formErrors = this.state.form_errors
        formErrors[input_to_reset] = null
        this.setState({form_errors: formErrors});
        console.log(this.state.form_errors)


    }

    signup_event(event) {

        let data = {
            username: this.state.username,
            password: this.state.password,
        }

        let url = 'user/signup'
        this.api.PostApi(data, url)
            .then(res => {
                if (res.request.status === 201) {

                    let url = 'user/signin'
                    this.api.PostApi(data, url)
                        .then(res => {
                            let err = JSON.parse(res.request.response)
                            if (res.request.status === 201) {
                                this.api.setToken(res.data.accessToken)
                                this.props.history.push('/step1')
                            } else if (res.request.status === 400) {
                                window.alert(err['message'])
                            } else {
                                window.alert('Connection failed')
                            }
                        }).catch(error => {
                            console.error(error)
                        window.alert('Connection failed, try again ')
                    });


                } else {
                    let err = JSON.parse(res.request.response)
                    window.alert(err['message'])
                }
            }).catch(error => {
            window.alert('Connection error try again letter')
        });
    }


    render() {
        return (
            <div className="limiter">
                <div className="container-login100 ">
                    <div className="wrap-login100 wow bounceInDown" data-wow-delay="0.5s">

                        <div className="login100-form validate-form" onSubmit={this.signup_event}>
                            <span className="login100-form-title ">Sign Up</span>

                            <div className="wrap-input100 validate-input ">
                                <span className="label-input100">Email Address</span>
                                <input className="input100" type="text" name="username"
                                       placeholder="Enter email address." value={this.state.username}
                                       onChange={this.usernameChangeHandler}/>
                                <span className="focus-input100 " data-symbol="	&#xf007;"/>

                                {this.state.form_errors.username ? (
                                    this.state.form_errors.username.map(error => (
                                        <span className="error_out">{error} </span>
                                    ))
                                ) : null}

                            </div>


                            <div className="wrap-input100 validate-input">
                                <span className="label-input100">password</span>
                                <input className="input100" type="password" name="password" value={this.state.password}
                                       onChange={this.passwordChangeHandler}
                                       placeholder="Enter password."/>
                                <span className="focus-input100" data-symbol="&#xf084;"/>
                                {this.state.form_errors.password ? (
                                    this.state.form_errors.password.map(error => (
                                        <span className="error_out">{error} </span>
                                    ))
                                ) : null}
                            </div>

                            <div className="container-login100-form-btn">
                                <div className="wrap-login100-form-btn">
                                    <div className="login100-form-bgbtn"/>
                                    <button type={"submit"} onClick={this.signup_event}
                                            className="login100-form-btn">Submit
                                    </button>
                                </div>
                            </div>

                        </div>
                        <div className="SignupContent">
                            <p id="terms">Already have an account.<a onClick={() => this.props.history.push('/signin')}> Sign In </a></p>
                        </div>

                    </div>
                </div>
            </div>

        )
    }
}

export default Signup;

