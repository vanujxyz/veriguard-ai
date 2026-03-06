import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const API_URL = 'http://127.0.0.1:8000';

function ViewClusters({ onBack }) {
  const [clusterData, setClusterData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchClusters();
  }, []);

  const fetchClusters = async () => {
    try {
      const response = await axios.get(`${API_URL}/clusters`);
      const data = Object.entries(response.data).map(([cluster, count]) => ({
        cluster: `Cluster ${cluster}`,
        logs: count
      }));
      setClusterData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load cluster data. Make sure backend is running.');
    }
    setLoading(false);
  };

  return (
    <div style={{
      width: '90%',
      maxWidth: 1100,
      height: 'calc(100vh - 140px)',
      maxHeight: 550,
      margin: '0 auto',
      marginTop: 110,
      background: '#9AD7FD',
      boxShadow: '7px 7px 0px black',
      borderRadius: 5,
      outline: '1px black solid',
      padding: '25px 40px',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* Header with title and back button */}
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, flexShrink: 0}}>
        <div style={{color: 'black', fontSize: 28, fontFamily: 'Syne', fontWeight: '600'}}>
          Failure Cluster Distribution
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

      {/* Chart Area */}
      <div style={{
        width: '100%',
        flex: 1,
        minHeight: 0,
        background: '#FFB7B6',
        boxShadow: '4px 4px 0px black',
        borderRadius: 5,
        outline: '1px black solid',
        padding: 15,
        display: 'flex',
        flexDirection: 'column'
      }}>
        
        {loading ? (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 24, fontFamily: 'Syne'}}>
            Loading...
          </div>
        ) : error ? (
          <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: 18, fontFamily: 'Syne', color: 'red'}}>
            {error}
          </div>
        ) : (
          <>
            <div style={{fontSize: 16, fontFamily: 'Syne', fontWeight: '600', marginBottom: 8, color: 'black'}}>
              📊 Log Count by Cluster (Total: {clusterData.reduce((sum, d) => sum + d.logs, 0).toLocaleString()} logs)
            </div>
            <div style={{flex: 1, minHeight: 0}}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={clusterData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="cluster" tick={{fontFamily: 'Syne', fontSize: 11}} />
                  <YAxis tick={{fontFamily: 'Syne', fontSize: 11}} />
                  <Tooltip 
                    contentStyle={{background: '#F7CC66', border: '2px solid black', borderRadius: 5, fontFamily: 'Syne'}}
                  />
                  <Bar dataKey="logs" fill="#BE8EF8" stroke="black" strokeWidth={1} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default ViewClusters;
