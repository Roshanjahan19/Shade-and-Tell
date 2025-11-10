import React, { useState, useEffect } from "react";
import "../CSS/RoutineManager.css";


const RoutineManager = ({ userId, email, onLogout }) => {
  const [routine, setRoutine] = useState([]);
  const [routineType, setRoutineType] = useState("AM");
  const [stepType, setStepType] = useState("");
  const [stepContent, setStepContent] = useState("");
  const [position, setPosition] = useState(1);
  const [loading, setLoading] = useState(false);

  const BASE_URL = "${import.meta.env.VITE_API_URL}";

  
  const fetchRoutine = async () => {
    try {
      const res = await fetch(`${BASE_URL}/routine/${userId}`);
      const data = await res.json();
      setRoutine(data);
    } catch (err) {
      console.error("Failed to fetch routine:", err);
    }
  };

  useEffect(() => {
    fetchRoutine();
    
  }, []);

  
  const addStep = async () => {
    if (!stepType.trim() || !stepContent.trim()) return;

    setLoading(true);

    try {
      await fetch(`${BASE_URL}/routine`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          routine_type: routineType,
          step_type: stepType,
          step_content: stepContent,
          position: Number(position)
        })
      });

      
      setStepType("");
      setStepContent("");
      setPosition(1);

      fetchRoutine();
    } catch (err) {
      console.error("Failed to add step:", err);
    }

    setLoading(false);
  };

  
  const deleteStep = async (id) => {
    try {
      await fetch(`${BASE_URL}/routine/${id}`, {
        method: "DELETE"
      });

      fetchRoutine();
    } catch (err) {
      console.error("Failed to delete step:", err);
    }
  };

  
  const amSteps = routine.filter((s) => s.routine_type === "AM");
  const pmSteps = routine.filter((s) => s.routine_type === "PM");

  return (
    <div className="routine-container">
      <h2 className="routine-title">My Skincare Routine</h2>

      
      <div className="add-step-card">
        <h3>Add New Step</h3>

        <select
          value={routineType}
          onChange={(e) => setRoutineType(e.target.value)}
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>

        <input
          type="text"
          placeholder="Step type (cleanser, toner...)"
          value={stepType}
          onChange={(e) => setStepType(e.target.value)}
        />

        <input
          type="text"
          placeholder="Step content"
          value={stepContent}
          onChange={(e) => setStepContent(e.target.value)}
        />

        <input
          type="number"
          placeholder="Position"
          min="1"
          value={position}
          onChange={(e) => setPosition(e.target.value)}
        />

        <button
          className="add-btn"
          onClick={addStep}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Step"}
        </button>
      </div>

      
      <h3 className="section-title"> AM Routine 𖤓</h3>

      {amSteps.length === 0 ? (
        <p className="no-steps">No AM steps yet.</p>
      ) : (
        amSteps
          .sort((a, b) => a.position - b.position)
          .map((step) => (
            <div key={step.id} className="step-card">
              <div className="step-info">
                <span className="step-title">
                  {step.position}. {step.step_type}{" - "}
                </span>
                <span className="step-desc">
                  {step.step_content}
                </span>
              </div>

              <button
                onClick={() => deleteStep(step.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
      )}

      
      <h3 className="section-title">PM Routine ⏾</h3>

      {pmSteps.length === 0 ? (
        <p className="no-steps">No PM steps yet.</p>
      ) : (
        pmSteps
          .sort((a, b) => a.position - b.position)
          .map((step) => (
            <div key={step.id} className="step-card">
              <div className="step-info">
                <span className="step-title">
                  {step.position}. {step.step_type}{" - "}
                </span>
                <span className="step-desc">
                  {step.step_content}
                </span>
              </div>

              <button
                onClick={() => deleteStep(step.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
      )}
    </div>
  );
};

export default RoutineManager;
