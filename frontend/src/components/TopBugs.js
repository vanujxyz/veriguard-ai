import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000';

function TopBugs({ onBack }) {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const response = await axios.get(`${API_URL}/top_bugs`);
      setBugs(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load bug data. Make sure backend is running.');
    }
    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'ERROR': return '#FFCDD2';
      case 'ASSERT_FAIL': return '#F8BBD9';
      case 'WARNING': return '#FFF9C4';
      default: return '#E0E0E0';
    }
  };

  return (
    <div style={{
      width: '90%',
      maxWidth: 1000,
      height: 'calc(100vh - 140px)',
      maxHeight: 480,
      margin: '0 auto',
      marginTop: 110,
      background: '#9AD7FD',
      boxShadow: '7px 7px 0px black',
      borderRadius: 5,
      outline: '1px black solid',
      padding: '20px 30px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header with title and back button */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexShrink: 0}}>
        <div style={{color: 'black', fontSize: 24, fontFamily: 'Syne', fontWeight: '600'}}>
          Top Critical Failure Clusters
        </div>
        
        <div 
          onClick={onBack}
          className="go-back-btn"
          style={{
            padding: '8px 18px',
            background: '#FB5E4C',
            boxShadow: '3px 4px 0px black',
            borderRadius: 5,
            outline: '1px black solid',
            cursor: 'pointer',
            color: 'black',
            fontSize: 16,
            fontFamily: 'Syne'
          }}
        >
          ← Go Back
        </div>
      </div>

      {/* Table Area */}
      <div style={{
        flex: 1,
        minHeight: 0,
        background: '#FFB7B6',
        boxShadow: '4px 4px 0px black',
        borderRadius: 5,
        outline: '1px black solid',
        padding: 15,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        
        {loading ? (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 20, fontFamily: 'Syne'}}>
            Loading...
          </div>
        ) : error ? (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 16, fontFamily: 'Syne', color: 'red'}}>
            {error}
          </div>
        ) : (
          <>
            <div style={{fontSize: 14, fontFamily: 'Syne', fontWeight: '600', marginBottom: 10, color: 'black', flexShrink: 0}}>
              🐛 Priority Ranking - Fix these first!
            </div>
            
            {/* Table Header */}
            <div style={{display: 'flex', background: '#333', color: 'white', padding: '8px 12px', borderRadius: '5px 5px 0 0', fontFamily: 'Syne', fontWeight: '600', fontSize: 12, flexShrink: 0}}>
              <div style={{flex: 0.5, textAlign: 'center'}}>Rank</div>
              <div style={{flex: 1}}>Cluster</div>
              <div style={{flex: 1}}>Occurrences</div>
              <div style={{flex: 1}}>Severity</div>
              <div style={{flex: 1}}>Priority</div>
            </div>

            {/* Table Rows - Scrollable */}
            <div style={{flex: 1, overflowY: 'auto', minHeight: 0}}>
              {bugs.map((bug, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex', 
                    background: index % 2 === 0 ? '#FFF' : '#F5F5F5',
                    padding: '10px 12px',
                    borderLeft: '1px solid #333',
                    borderRight: '1px solid #333',
                    borderBottom: '1px solid #ddd',
                    fontFamily: 'Syne',
                    fontSize: 13,
                    alignItems: 'center'
                  }}
                >
                  <div style={{flex: 0.5, textAlign: 'center'}}>
                    <span style={{
                      background: index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#E0E0E0',
                      padding: '3px 10px',
                      borderRadius: 15,
                      fontWeight: '600',
                      fontSize: 12
                    }}>
                      #{index + 1}
                    </span>
                  </div>
                  <div style={{flex: 1, fontWeight: '600'}}>Cluster {bug.cluster}</div>
                  <div style={{flex: 1}}>{bug.occurrences.toLocaleString()}</div>
                  <div style={{flex: 1}}>
                    <span style={{
                      background: getSeverityColor(bug.severity),
                      padding: '3px 8px',
                      borderRadius: 4,
                      fontWeight: '500',
                      fontSize: 11,
                      border: '1px solid #999'
                    }}>
                      {bug.severity}
                    </span>
                  </div>
                  <div style={{flex: 1, fontWeight: '700', color: '#D32F2F', fontSize: 15}}>
                    {bug.priority_score.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div style={{marginTop: 10, padding: 10, background: '#F7CC66', borderRadius: 5, border: '1px solid black', flexShrink: 0}}>
              <div style={{fontFamily: 'Syne', fontSize: 12}}>
                <strong>Priority Score</strong> = Occurrences × Severity Weight. Higher = More urgent.
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TopBugs;
