import React, { useState, useEffect } from 'react';
import { Plus, ArrowLeft, Image, MapPin, Smile, Bold, Italic, List, Save } from 'lucide-react';
import { useGlobalContext } from '../GlobalContext';
import './TravelJournal.css';

const TravelJournal = () => {
  const { addToast } = useGlobalContext();
  const [journals, setJournals] = useState([]);
  const [view, setView] = useState('list'); // 'list', 'edit'
  const [activeJournal, setActiveJournal] = useState(null);
  const [entryData, setEntryData] = useState({ title: '', content: '', location: '', mood: 'Happy' });

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      // Create a default journal if none exist
      const res = await fetch(`http://localhost:5000/api/journals`, { credentials: 'include' });
      const data = await res.json();
      
      if (data.journals.length === 0) {
        const createRes = await fetch(`http://localhost:5000/api/journals`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ title: 'My Travel Scrapbook' })
        });
        const createData = await createRes.json();
        setJournals([createData.journal]);
        setActiveJournal(createData.journal);
      } else {
        setJournals(data.journals);
        setActiveJournal(data.journals[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEntry = async () => {
    if (!entryData.title || !entryData.content) return;
    try {
      const res = await fetch(`http://localhost:5000/api/journals/${activeJournal.id}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(entryData)
      });
      const data = await res.json();
      
      const updatedJournals = journals.map(j => {
        if (j.id === activeJournal.id) {
          return { ...j, entries: [data.entry, ...j.entries] };
        }
        return j;
      });
      
      setJournals(updatedJournals);
      setActiveJournal(updatedJournals.find(j => j.id === activeJournal.id));
      setView('list');
      setEntryData({ title: '', content: '', location: '', mood: 'Happy' });
      addToast('Journal entry saved!', 'success');
    } catch (err) {
      addToast('Failed to save entry', 'error');
    }
  };

  if (view === 'edit') {
    return (
      <div className="editor-container">
        <div className="editor-header">
          <button className="icon-btn-small" onClick={() => setView('list')}><ArrowLeft size={18}/> Back</button>
          <button className="btn-primary" onClick={handleSaveEntry}><Save size={16}/> Save Entry</button>
        </div>
        
        <input 
          type="text" 
          placeholder="Entry Title" 
          className="auth-input" 
          style={{ fontSize: '1.5rem', fontWeight: 'bold', border: 'none', background: 'transparent', padding: 0, marginBottom: '1rem' }}
          value={entryData.title}
          onChange={e => setEntryData({...entryData, title: e.target.value})}
        />
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="auth-input-group" style={{ background: 'rgba(0,0,0,0.2)', border: 'none' }}>
            <MapPin size={16} color="var(--text-secondary)"/>
            <input type="text" placeholder="Location" className="auth-input" value={entryData.location} onChange={e => setEntryData({...entryData, location: e.target.value})} style={{ padding: '0.5rem', background:'transparent', border:'none' }} />
          </div>
          <div className="auth-input-group" style={{ background: 'rgba(0,0,0,0.2)', border: 'none' }}>
            <Smile size={16} color="var(--text-secondary)"/>
            <select className="auth-input" value={entryData.mood} onChange={e => setEntryData({...entryData, mood: e.target.value})} style={{ padding: '0.5rem', background:'transparent', border:'none', color:'var(--text-primary)' }}>
              <option value="Happy">Happy</option>
              <option value="Excited">Excited</option>
              <option value="Relaxed">Relaxed</option>
              <option value="Tired">Tired</option>
            </select>
          </div>
        </div>

        <div className="editor-toolbar">
          <button className="icon-btn-small"><Bold size={16}/></button>
          <button className="icon-btn-small"><Italic size={16}/></button>
          <button className="icon-btn-small"><List size={16}/></button>
          <div style={{width:'1px', background:'rgba(255,255,255,0.1)', margin:'0 0.5rem'}}></div>
          <button className="icon-btn-small"><Image size={16}/></button>
        </div>

        <textarea 
          className="editor-content" 
          placeholder="Write your travel story here..."
          value={entryData.content}
          onChange={e => setEntryData({...entryData, content: e.target.value})}
        ></textarea>
      </div>
    );
  }

  return (
    <div className="journal-container">
      <div className="journal-header">
        <h2>{activeJournal?.title || 'My Travel Journal'}</h2>
        <button className="btn-primary" onClick={() => setView('edit')}><Plus size={16}/> New Entry</button>
      </div>

      <div className="journal-grid">
        {activeJournal?.entries?.map(entry => (
          <div key={entry.id} className="journal-card">
            <div className="journal-date">{new Date(entry.createdAt).toLocaleDateString()}</div>
            <h3 className="journal-title">{entry.title}</h3>
            <p className="journal-preview">{entry.content}</p>
            <div className="journal-footer">
              <span className="mood-tag"><Smile size={14}/> {entry.mood}</span>
              {entry.location && <span style={{display:'flex', alignItems:'center', gap:'0.3rem'}}><MapPin size={14}/> {entry.location}</span>}
            </div>
          </div>
        ))}
        {(!activeJournal || activeJournal.entries?.length === 0) && (
          <div style={{gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)'}}>
            No entries yet. Start capturing your travel memories!
          </div>
        )}
      </div>
    </div>
  );
};

export default TravelJournal;
