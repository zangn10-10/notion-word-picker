import React, { useEffect, useRef, useState } from 'react';

export default function NotionWordPicker() {
  const STORAGE_KEY = "nv_word_picker_tags_v1";
  const [tags, setTags] = useState([]);
  const [filter, setFilter] = useState("");
  const [newText, setNewText] = useState("");
  const [inputValue, setInputValue] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) setTags(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
  }, [tags]);

  function addTag(e) {
    e.preventDefault();
    if (!newText.trim()) return;
    setTags([{ id: Date.now().toString(), text: newText.trim() }, ...tags]);
    setNewText("");
  }

  function insertTagText(tagText) {
    const ta = textareaRef.current;
    if (!ta) return setInputValue((v) => (v ? v + " " + tagText : tagText));
    const start = ta.selectionStart ?? ta.value.length;
    const end = ta.selectionEnd ?? start;
    const before = ta.value.slice(0, start);
    const after = ta.value.slice(end);
    const newVal = before + tagText + after;
    setInputValue(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      const cursor = start + tagText.length;
      ta.setSelectionRange(cursor, cursor);
    });
  }

  const filtered = tags.filter((t) => t.text.toLowerCase().includes(filter.toLowerCase()));
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <form onSubmit={addTag} style={{ marginBottom: 10 }}>
        <input value={newText} onChange={(e)=>setNewText(e.target.value)} placeholder="输入词" style={{ padding:5, flex:1 }}/>
        <button type="submit" style={{ marginLeft:5 }}>添加词</button>
      </form>
      <input value={filter} onChange={e=>setFilter(e.target.value)} placeholder="搜索" style={{ padding:5, marginBottom:10, width:"100%" }}/>
      <div style={{ display:"flex", flexWrap:"wrap", gap:5, marginBottom:10 }}>
        {filtered.map(t=>(
          <button key={t.id} onClick={()=>insertTagText(t.text)} style={{ padding:"5px 10px" }}>{t.text}</button>
        ))}
      </div>
      <textarea ref={textareaRef} value={inputValue} onChange={e=>setInputValue(e.target.value)} style={{ width:"100%", minHeight:100, padding:5 }} placeholder="点击上方词库插入文本"/>
    </div>
  );
}