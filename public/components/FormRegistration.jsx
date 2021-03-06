class FormRegistration extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        name: PropTypes.string,
        email: PropTypes.string,
        password: PropTypes.string,
        callback: PropTypes.func,
    };

    static defaultProps = {
        className: 'block-login',
        name: '',
        email: '',
        password: '',
        callback: () => undefined,
    };

    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            email: props.email,
            password: props.password,
            promoCode: '',
            errors: null,
            running: false,
            hasPromoCode: false,
        };

        this.onChangeName = this.onChangeName.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onClickPromoCode = this.onClickPromoCode.bind(this);
        this.onChangePromoCode = this.onChangePromoCode.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    hasErrors(prop = null) {
        return prop ? this.state.errors?.has(prop) : !!this.state.errors?.size;
    }

    getErrors(prop = null) {
        if (prop) {
            return this.state.errors?.get(prop);
        }
        if (this.hasErrors()) {
            const errors = [];
            this.state.errors.forEach((value) => errors.push(value));
            return errors.filter((item) => !!item).join(', ');
        }
        return null;
    }

    onChangeName(event) {
        this.setState({ name: event.target.value, errors: null });
    }

    onChangeEmail(event) {
        this.setState({ email: event.target.value, errors: null });
    }

    onChangePassword(event) {
        this.setState({ password: event.target.value, errors: null });
    }

    onClickPromoCode(event) {
        this.setState({ hasPromoCode: true });
    }

    onChangePromoCode(event) {
        this.setState({ promoCode: event.target.value, errors: null });
    }

    onSubmit() {
        if (!this.validate()) {
            return;
        }

        this.setState({ running: true });

        BackendHelper.registration(this.state.name, this.state.email, this.state.password, this.state.promoCode)
            .then((success) => {
                this.setState({ running: false });
                if (success) {
                    this.props.callback({ success: true, user: { name: this.state.name, email: this.state.email } });
                } else {
                    this.setState({
                        errors: new Map([
                            ['form', '???????????????? ??????, ??mail ?????? ????????????'],
                            ['name', null],
                            ['email', null],
                            ['password', null],
                        ])
                    });
                }
            });
    }

    validate() {
        const errors = new Map();
        if (this.state.name.trim() === '') {
            errors.set('name', '?????????????? ??????');
        } else if (!ValidateHelper.validateName(this.state.name)) {
            errors.set('name', '?????????????? ???????????????????? ??????');
        }
        if (this.state.email.trim() === '') {
            errors.set('email', '?????????????? email');
        } else if (!ValidateHelper.validateEmail(this.state.email)) {
            errors.set('email', '???????????????? ???? ???????????????? ?? ???????????????? ?????????????????? ??????????????');
        }
        if (this.state.password.trim() === '') {
            errors.set('password', '?????????????? ????????????');
        } else if (!ValidateHelper.validatePassword(this.state.password)) {
            errors.set('password', '?????????????? ???????????????????? ????????????');
        }
        this.setState({ errors });
        return !errors.size;
    }

    render() {
        return (
            <div className={this.props.className}>
                <div className="caption">??????????????????????</div>
                <div className="caption-details">?????????????????????????????? ?? ???????????? ???????????? ?? ?????????????????? ??????????????????.</div>
                <div className="social-network-login">
                    <SocialNetworksLogin />
                </div>
                <div className="form-text">??????</div>
                <div className="form-input">
                    <label>??????</label>
                    <input
                        className={this.state.errors?.has('name') ? 'error' : null}
                        type="text"
                        value={this.state.name}
                        placeholder="??????"
                        onChange={this.onChangeName}
                        disabled={this.state.running}
                    />
                </div>
                {this.hasErrors('name') && (
                    <div className="form-error">
                        {this.getErrors('name')}
                    </div>
                )}
                <div className="form-input">
                    <label>Email</label>
                    <input
                        className={this.state.errors?.has('email') ? 'error' : null}
                        type="text"
                        value={this.state.email}
                        placeholder="Email"
                        onChange={this.onChangeEmail}
                        disabled={this.state.running}
                    />
                </div>
                {this.hasErrors('email') && (
                    <div className="form-error">
                        {this.getErrors('email')}
                    </div>
                )}
                <div className="form-input">
                    <label>Password</label>
                    <input
                        className={this.state.errors?.has('password') ? 'error' : null}
                        type="password"
                        value={this.state.password}
                        placeholder="????????????"
                        onChange={this.onChangePassword}
                        disabled={this.state.running}
                    />
                </div>
                {this.hasErrors('password') && (
                    <div className="form-error">
                        {this.getErrors('password')}
                    </div>
                )}
                {this.state.hasPromoCode ? (
                    <div className="form-input">
                        <label>????????????????</label>
                        <input
                            className={this.state.errors?.has('promoCode') ? 'error' : null}
                            type="text"
                            value={this.state.promoCode}
                            placeholder="????????????????"
                            onChange={this.onChangePromoCode}
                            disabled={this.state.running}
                        />
                    </div>
                ) : (
                    <div className="form-question">
                        <a href="#" onClick={this.onClickPromoCode}>?? ???????? ???????? ????????????????</a>
                    </div>
                )}
                <div className="form-submit">
                    <button
                        className={`${this.props.className}-submit`}
                        onClick={this.onSubmit}
                        disabled={this.state.running}
                    >
                        {this.state.running ? (
                            <>
                                <img src="images/loader.svg" />
                                <span>????????????????</span>
                            </>
                        ) : (
                            <span>?????????????? ??????????????</span>
                        )}
                    </button>
                </div>
                <div className="form-question">
                    ???????????????? ?????????????? ?? ???????????????? ?? <a href="#" onClick={() => alert('Clicked Agreement')}>??????????????????
                    ????????????</a>
                </div>
            </div>
        );
    }
}
