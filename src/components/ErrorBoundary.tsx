import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          height: '100vh', 
          padding: '20px', 
          textAlign: 'center', 
          fontFamily: 'sans-serif',
          backgroundColor: '#f9fafb',
          direction: 'rtl'
        }}>
          <AlertTriangle size={64} color="#CE1126" style={{ marginBottom: '20px' }} />
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>عذراً، حدث خطأ في النظام</h1>
          <p style={{ color: '#666', marginBottom: '20px' }}>فشل تحميل التطبيق. يرجى محاولة تحديث الصفحة.</p>
          {this.state.error && (
            <pre style={{ 
              backgroundColor: '#fff', 
              padding: '15px', 
              borderRadius: '8px', 
              border: '1px solid #ddd', 
              fontSize: '12px', 
              textAlign: 'left', 
              maxWidth: '100%', 
              overflow: 'auto' 
            }}>
              {this.state.error.toString()}
            </pre>
          )}
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#CE1126',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '20px'
            }}
          >
            إعادة تحميل الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
