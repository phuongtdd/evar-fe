import type React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Layout } from "antd";
import AuthBg from "../ui/AuthBg";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <Layout className="h-screen">
        <div className="flex flex-column item-center justify-center w-full h-full">
          <div className="auth-content">
            <AuthBg/>
            <Container className="d-flex justify-content-center">
              <Row className="w-100 justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5} className="mx-auto">
                  <Card className="auth-card !rounded-2xl z-10">
                    <Card.Body className="p-4 p-md-5">
                      <div className="text-center mb-4 w-full flex flex-column item-center justify-center">
                        <div className="auth-icon mb-3 w-full flex item-center justify-center">
                          <img
                            src="/square.png"
                            alt="decorative square"
                            className="icon-square-img "
                          />
                        </div>
                        <h2 className="auth-title mb-2">{title}</h2>
                        <p className="auth-subtitle text-muted">{subtitle}</p>
                      </div>
                      {children}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        </div>
    </Layout>
  );
};

export default AuthLayout;
