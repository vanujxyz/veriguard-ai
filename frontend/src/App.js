import React, { useState } from 'react';
import AnalyzeLog from './components/AnalyzeLog';
import ViewClusters from './components/ViewClusters';
import TopBugs from './components/TopBugs';
import './App.css';

function App() {
  const [activeView, setActiveView] = useState('home');

  const renderContent = () => {
    switch(activeView) {
      case 'analyze':
        return <AnalyzeLog onBack={() => setActiveView('home')} />;
      case 'clusters':
        return <ViewClusters onBack={() => setActiveView('home')} />;
      case 'bugs':
        return <TopBugs onBack={() => setActiveView('home')} />;
      default:
        return renderHome();
    }
  };

  const renderHome = () => (
    <div style={{
      width: '90%',
      maxWidth: 1000,
      height: 'calc(100vh - 140px)',
      maxHeight: 420,
      margin: '0 auto',
      marginTop: 110,
      background: '#9AD7FD',
      boxShadow: '7px 7px 0px black',
      borderRadius: 5,
      outline: '1px black solid',
      padding: '25px 35px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      <div style={{color: 'black', fontSize: 26, fontFamily: 'Syne', fontWeight: '600', marginBottom: 15, flexShrink: 0, textAlign: 'center'}}>
        VeriGuard AI Dashboard
      </div>

      {/* Three Boxes Container */}
      <div style={{display: 'flex', gap: 30, justifyContent: 'center', flex: 1, alignItems: 'stretch', padding: '10px 0'}}>
        
        {/* Box 1: Analyze Log */}
        <div 
          onClick={() => setActiveView('analyze')}
          style={{
            flex: 1,
            maxWidth: 280,
            background: '#FFB7B6',
            boxShadow: '4px 4px 0px black',
            borderRadius: 8,
            outline: '1px black solid',
            cursor: 'pointer',
            padding: '25px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="feature-box"
        >
          <div style={{fontSize: 44}}>🔍</div>
          <div style={{fontSize: 20, fontFamily: 'Syne', fontWeight: '600', marginTop: 12}}>Analyze Log</div>
          <div style={{fontSize: 12, fontFamily: 'Syne', marginTop: 10, color: '#333', lineHeight: 1.4}}>
            Paste your RTL verification log and detect failures instantly
          </div>
        </div>

        {/* Box 2: View Clusters */}
        <div 
          onClick={() => setActiveView('clusters')}
          style={{
            flex: 1,
            maxWidth: 280,
            background: '#FFB7B6',
            boxShadow: '4px 4px 0px black',
            borderRadius: 8,
            outline: '1px black solid',
            cursor: 'pointer',
            padding: '25px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="feature-box"
        >
          <div style={{fontSize: 44}}>📊</div>
          <div style={{fontSize: 20, fontFamily: 'Syne', fontWeight: '600', marginTop: 12}}>View Clusters</div>
          <div style={{fontSize: 12, fontFamily: 'Syne', marginTop: 10, color: '#333', lineHeight: 1.4}}>
            See failure cluster distribution and identify patterns in logs
          </div>
        </div>

        {/* Box 3: Top Bugs */}
        <div 
          onClick={() => setActiveView('bugs')}
          style={{
            flex: 1,
            maxWidth: 280,
            background: '#FFB7B6',
            boxShadow: '4px 4px 0px black',
            borderRadius: 8,
            outline: '1px black solid',
            cursor: 'pointer',
            padding: '25px 20px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          className="feature-box"
        >
          <div style={{fontSize: 44}}>🐛</div>
          <div style={{fontSize: 20, fontFamily: 'Syne', fontWeight: '600', marginTop: 12}}>Top Bugs</div>
          <div style={{fontSize: 12, fontFamily: 'Syne', marginTop: 10, color: '#333', lineHeight: 1.4}}>
            View prioritized critical failures and focus on what matters most
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{width: '100%', height: '100vh', background: '#FEE3D2', overflow: 'hidden'}}>
      
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 50px',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: '#FEE3D2',
        zIndex: 100
      }}>
        {/* Logo */}
        <div style={{
          padding: '10px 20px',
          background: 'black',
          borderRadius: 4,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <span style={{color: 'white', fontSize: 16, fontFamily: 'Syne', fontWeight: '600'}}>VeriGuard AI</span>
        </div>

        {/* Navigation */}
        <div style={{
          padding: '10px 22px',
          background: '#BE8EF8',
          boxShadow: '3px 4px 0px black',
          borderRadius: 5,
          outline: '1px black solid',
          display: 'flex',
          gap: 25
        }}>
          <div 
            onClick={() => setActiveView('home')}
            style={{color: 'black', fontSize: 18, fontFamily: 'Syne', fontWeight: '400', textDecoration: activeView === 'home' ? 'underline' : 'none', cursor: 'pointer'}}
          >Dashboard</div>
          <div 
            onClick={() => setActiveView('analyze')}
            style={{color: 'black', fontSize: 18, fontFamily: 'Syne', fontWeight: '400', textDecoration: activeView === 'analyze' ? 'underline' : 'none', cursor: 'pointer'}}
          >Analyze</div>
          <div 
            onClick={() => setActiveView('clusters')}
            style={{color: 'black', fontSize: 18, fontFamily: 'Syne', fontWeight: '400', textDecoration: activeView === 'clusters' ? 'underline' : 'none', cursor: 'pointer'}}
          >Clusters</div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
}

export default App;
