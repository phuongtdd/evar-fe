"use client"
import type React from "react"
import { useState } from "react"
import { Container, Row, Col, Form, Button, Card } from "react-bootstrap"
import Header from "../../Common/Header"
// Footer removed
import Sidebar from "../../Common/Sidebar"
import { Layout } from "antd"
import { Eye, EyeSlash } from "react-bootstrap-icons"
import { register, setToken } from "../../../configs/authen"
import { useNavigate } from "react-router-dom"
import "./Register.css"

const Register: React.FC = () => {
	const [fullName, setFullName] = useState<string>("")
	const [email, setEmail] = useState<string>("")
	const [password, setPassword] = useState<string>("")
	const [confirmPassword, setConfirmPassword] = useState<string>("")
	const [showPassword, setShowPassword] = useState<boolean>(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)
	const [agreeTerms, setAgreeTerms] = useState<boolean>(false)
	const [error, setError] = useState<string>("")

	const togglePasswordVisibility = () => setShowPassword((s) => !s)
	const toggleConfirmPasswordVisibility = () => setShowConfirmPassword((s) => !s)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		setError("")

		if (!fullName.trim() || !email.trim() || !password) {
			setError("Vui lòng điền đầy đủ thông tin.")
			return
		}

		if (password !== confirmPassword) {
			setError("Mật khẩu xác nhận không khớp.")
			return
		}

		if (!agreeTerms) {
			setError("Vui lòng đồng ý với điều khoản dịch vụ.")
			return
		}

		try {
			const data = await register(fullName, email, password)
			const token = data?.result?.token || data?.token
			if (token) {
				setToken(token, false)
				navigate("/dashboard", { replace: true })
			} else {
				setError("Không nhận được token từ server.")
			}
		} catch (err: any) {
			console.error("Register error:", err)
			setError(err?.message || "Lỗi khi đăng ký")
		}
	}

	const handleSocialRegister = (provider: string) => {
		console.log(`Register with ${provider}`)
	}

	const navigate = useNavigate()

	return (
			<Layout className="h-screen">
				<Sidebar selectedKey={"home"} onMenuSelect={() => {}} collapsed={false} onToggle={() => {}} />
				<Layout>
					<Header />
					<Layout.Content className="overflow-auto">
						<div className="register-page content-with-sidebar">
							<div className="register-content">
				<div className="decorative-element rocket-1" aria-hidden="true">
					<img src="/3d-rocket-blue-orange-flying.jpg" alt="" aria-hidden="true" />
				</div>
				<div className="decorative-element globe" aria-hidden="true">
					<img src="/3d-globe-earth-on-platform-blue.jpg" alt="" aria-hidden="true" />
				</div>
				<div className="decorative-element candy" aria-hidden="true">
					<img src="/3d-graduation-cap-wrapped-blue-orange.png" alt="" aria-hidden="true" />
				</div>
				<div className="decorative-element cards" aria-hidden="true">
					<img src="/3d-credit-cards-blue-pink.jpg" alt="" aria-hidden="true" />
				</div>
				<div className="decorative-element rocket-2" aria-hidden="true">
					<img src="/3d-rocket-small-blue-pink.jpg" alt="" aria-hidden="true" />
				</div>

				<Container>
					<Row className="justify-content-center">
						<Col xs={12} sm={10} md={8} lg={6} xl={5}>
							<Card className="register-card">
								<Card.Body className="p-4 p-md-5">
									<div className="text-center mb-4">
										<div className="register-icon mb-3">
											<img src="/square.png" alt="decorative square" className="icon-square-img" />
										</div>
										<h2 className="register-title mb-2">Tạo tài khoản</h2>
										<p className="register-subtitle text-muted">Điền thông tin để tạo tài khoản mới</p>
									</div>

									<div className="social-login mb-4">
										<button
											type="button"
											className="social-btn"
											onClick={() => handleSocialRegister("Microsoft")}
											aria-label="Register with Microsoft"
										>
											<img src="/microsoft-logo.png" alt="Microsoft" />
										</button>
										<button
											type="button"
											className="social-btn"
											onClick={() => handleSocialRegister("Google")}
											aria-label="Register with Google"
										>
											<img src="/google-logo.png" alt="Google" />
										</button>
										<button
											type="button"
											className="social-btn"
											onClick={() => handleSocialRegister("Telegram")}
											aria-label="Register with Telegram"
										>
											<img src="/telegram-logo-blue.png" alt="Telegram" />
										</button>
									</div>

									<div className="divider mb-4">
										<span>Hoặc</span>
									</div>

									<Form onSubmit={handleSubmit}>
										<Form.Group className="mb-3">
											<Form.Label>Họ và tên</Form.Label>
											<Form.Control
												type="text"
												placeholder="Nhập họ và tên"
												value={fullName}
												onChange={(e) => setFullName(e.target.value)}
												className="register-input"
											/>
										</Form.Group>

										<Form.Group className="mb-3">
											<Form.Label>Email</Form.Label>
											<Form.Control
												type="email"
												placeholder="Nhập địa chỉ email của bạn..."
												value={email}
												onChange={(e) => setEmail(e.target.value)}
												className="register-input"
											/>
										</Form.Group>

										<Form.Group className="mb-3 position-relative">
											<Form.Label>Mật khẩu</Form.Label>
											<Form.Control
												type={showPassword ? "text" : "password"}
												placeholder="••••••••••"
												value={password}
												onChange={(e) => setPassword(e.target.value)}
												className="register-input password-input"
											/>
											<button
												type="button"
												className="password-toggle"
												onClick={togglePasswordVisibility}
												aria-label="Toggle password visibility"
											>
												{showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
											</button>
										</Form.Group>

										<Form.Group className="mb-3 position-relative">
											<Form.Label>Xác nhận mật khẩu</Form.Label>
											<Form.Control
												type={showConfirmPassword ? "text" : "password"}
												placeholder="Nhập lại mật khẩu"
												value={confirmPassword}
												onChange={(e) => setConfirmPassword(e.target.value)}
												className="register-input password-input"
											/>
											<button
												type="button"
												className="password-toggle"
												onClick={toggleConfirmPasswordVisibility}
												aria-label="Toggle confirm password visibility"
											>
												{showConfirmPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
											</button>
										</Form.Group>

										<Form.Group className="mb-3 d-flex align-items-center">
											<Form.Check
												type="checkbox"
												id="agree-terms"
												label={<span>Tôi đồng ý với <a href="#terms">điều khoản dịch vụ</a></span>}
												checked={agreeTerms}
												onChange={(e) => setAgreeTerms(e.target.checked)}
												className="agree-terms"
											/>
										</Form.Group>

										{error && <div className="alert alert-danger">{error}</div>}

										<Button type="submit" className="register-button w-100 mb-3">
											Đăng ký
										</Button>
									</Form>

														<p className="signup-text text-center mb-0">
															Đã có tài khoản ? {" "}
															<a
																href="#"
																className="signup-link"
																onClick={(e) => {
																	e.preventDefault()
																	navigate('/login')
																}}
															>
																Đăng nhập
															</a>
														</p>
								</Card.Body>
							</Card>
						</Col>
					</Row>
						</Container>
								</div>
							</div>
					</Layout.Content>
					</Layout>
				</Layout>
	)
}

export default Register
