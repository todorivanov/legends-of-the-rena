import { Layout } from 'antd';
import { ReactNode } from 'react';

const { Header, Content, Footer } = Layout;

interface GameLayoutProps {
  children: ReactNode;
  header?: ReactNode;
  footer?: ReactNode;
}

export const GameLayout = ({ children, header, footer }: GameLayoutProps) => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      {header && (
        <Header style={{ 
          display: 'flex', 
          alignItems: 'center',
          padding: '0 24px',
          background: '#001529'
        }}>
          {header}
        </Header>
      )}
      <Content style={{ 
        display: 'flex', 
        flexDirection: 'column',
        padding: '24px'
      }}>
        {children}
      </Content>
      {footer && (
        <Footer style={{ textAlign: 'center', background: '#f0f2f5' }}>
          {footer}
        </Footer>
      )}
    </Layout>
  );
};
