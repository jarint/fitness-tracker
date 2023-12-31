// Author:David Oti-George

import "./Workouts.css";
import { useNavigate } from "react-router-dom";

import Exercise from "../Exercise";
import DatePicker from "../DatePicker";
import Popup from "../Popup";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import B_Back_arrow from "../icons/back_arrow.svg";

function Workouts({
  dataByDate,
  date,
  setDate,
  setDataByDate,
  statsPageExercise,
  setStatsPageExercise,
}) {
  const navigate = useNavigate();
  const wDataByDate = dataByDate;
  const [datePickerStatus, setDatePickerStatus] = useState(false);
  const dateString = new Date(date + "T00:00:00").toDateString();
  const [exercises, setExercises] = useState(dataByDate[dateString]);

  //loads the exercises froma given date on each rerender
  useEffect(() => {
    setExercises(wDataByDate[dateString]);
  }, [dateString, wDataByDate]);

  const numExercises = exercises.length;
  const isExercise = numExercises > 0;

  const [popupExercise, setPopupExercise] = useState("");
  const [popupSets, setPopupSets] = useState("");
  const [popupReps, setPopupReps] = useState("");
  const [popupError, setPopupError] = useState("");

  const [popupNewName, setPopupNewName] = useState("");

  const [exerciseBeinglookedAt, setExercseBeingLookedAt] = useState("");

  //useState variable for popups
  const [renameOpen, setRenameOpen] = useState(false); //rename popup
  const [addExerciseOpen, setAddExerciseOpen] = useState(false); //addExercise popup
  const [deleteOpen, setDeleteOpen] = useState(false); //delete exercise popup

  function saveNewExercise(eDate, eName, eSets, eReps) {
    //add the new exercise and reps to todays date, then add that exercise to all th eother dates with sets = 0 and reps = 0
    //add the exercise to all the workouts with set count of 0 and rep count of 0

    // Loop through each date in the dataByDate object, and add the exercise with sets and reps set to 0
    for (const date in wDataByDate) {
      if (Object.hasOwnProperty.call(wDataByDate, date)) {
        const workouts = wDataByDate[date];

        dataByDate[date] = [
          ...workouts,
          { name: eName, sets: 0, reps: 0, weight: 0, notes: "" },
        ];
      }
    }

    //then change the set and rep count for the current date
    wDataByDate[eDate].map((exercise) => {
      if (exercise.name === eName) {
        // Change the reps value for the exercise with the name "Calf Raises"
        exercise.sets = eSets;
        exercise.reps = eReps;
      }
      return exercise; // Return unchanged exercise for other items in the array
    });

    setDataByDate(wDataByDate);
    console.log(dataByDate);
  }

  function saveRenamedExercise() {
    //rename the exercise for every date in the dataByDate Array as Well
    for (const date in wDataByDate) {
      if (Object.hasOwnProperty.call(wDataByDate, date)) {
        const workouts = wDataByDate[date];

        wDataByDate[date] = workouts.map((exercise) => {
          if (exercise.name === exerciseBeinglookedAt) {
            exercise.name = popupNewName; //rename the exercise
          }
          return exercise;
        });
      }
    }

    setDataByDate(wDataByDate);
    console.log(dataByDate);

    setRenameOpen(false);
    setPopupNewName("");
    setPopupError("");
  }

  function checkDuplicate(newName) {
    //check  exercises for an exercise with the same name as the Duplicate if there is a duplicate return true else return false
    const lowerCaseName = newName.toLowerCase();
    const exists = exercises.some(
      (exercise) => exercise.name.toLowerCase() === lowerCaseName
    );
    return exists;
  }

  function toggleDatePickerStatus() {
    setDatePickerStatus((currStatus) => !currStatus);
  }

  function handleRenameClicked(name) {
    setExercseBeingLookedAt(name);
    setRenameOpen(true);
    //create a state variable to rename active and while rename is active we will display an input form to allow them to change the name
  }

  function handleDeleteClicked(name) {
    setExercseBeingLookedAt(name);
    setDeleteOpen(true);
  }

  function handleExerciseClicked(name) {
    setStatsPageExercise(name);
    console.log(statsPageExercise);
    navigate("/Stats");
  }

  function handleDeleteExercise() {
    const name = exerciseBeinglookedAt;
    setExercises((currExercises) =>
      currExercises.filter((exercise) => exercise.name !== name)
    ); //delete the exercise

    //delete the exercise for every date in the dataByDate Array as Well
    for (const date in wDataByDate) {
      if (Object.hasOwnProperty.call(wDataByDate, date)) {
        const workouts = wDataByDate[date];

        wDataByDate[date] = workouts.filter(
          (exercise) => exercise.name !== name
        ); //delete the exercise
      }
    }

    setDataByDate(wDataByDate); //update the state variable with the dictionary of data
    console.log(dataByDate);

    setExercseBeingLookedAt("");
    toggleDeleteExercise();
  }

  function handleNewExerciseSaved() {
    //check that the the inputs arent empty
    if (popupExercise === "") {
      setPopupError("Please name your exercise.");
    } else if (checkDuplicate(popupExercise)) {
      //checks if the excercise name exists already
      setPopupError("That name already exists.");
    } else {
      const sets = Number(popupSets);
      const reps = Number(popupReps);

      setExercises((currExercises) => [
        ...currExercises,
        { name: popupExercise, sets: sets, reps: reps },
      ]);

      // console.log(exercises);
      saveNewExercise(dateString, popupExercise, sets, reps);

      toggleAddExercise();
    }
  }

  function handleRenameExercise() {
    if (checkDuplicate(popupNewName)) {
      //ee if the exercise name already exists within the exercises list then change value of popup error
      setPopupError("Please use a different name");
    } else if (popupNewName === "") {
      setPopupError("Please give your exercise a name");
    } else {
      saveRenamedExercise();
    }
  }

  function toggleAddExercise() {
    setAddExerciseOpen((currStatus) => !currStatus);
    setPopupExercise("");
    setPopupSets("");
    setPopupReps("");
    setPopupError("");
  }

  function toggleDeleteExercise() {
    setDeleteOpen((deleteStatus) => !deleteStatus);
  }

  function toggleRenameExercise() {
    setRenameOpen((renameStatus) => !renameStatus);
    setPopupNewName("");
    setPopupError("");
  }

  return (
    <div className="workouts_container">
      <div className="workouts">
        <Link className="link_back" to="/">
          {/* <button
            className="back-button2"
            style={{ position: "absolute", top: 0, left: 10 }}
          >
            BACK
          </button> */}
          <img
            className="w_back_btn"
            src={B_Back_arrow}
            // style={{ position: "absolute", top: 0, left: 10 }}
            alt="Previous Page"
          />
          <h1>My Workouts</h1>
        </Link>

        {datePickerStatus ? (
          <div className="date">
            <DatePicker
              selectedDate={date}
              setDate={setDate}
              toggleDatePicker={toggleDatePickerStatus}
            />
          </div>
        ) : (
          <button className="date_btn" onClick={toggleDatePickerStatus}>
            {dateString}
          </button>
        )}
        <div className="whiteBox_container">
          {isExercise ? (
            <div className="exercise_container">
              {exercises.map((exercise) => (
                <Exercise
                  key={exercise.name}
                  name={exercise.name}
                  sets={exercise.sets}
                  reps={exercise.reps}
                  onDeleteClicked={handleDeleteClicked}
                  onRenameClicked={handleRenameClicked}
                  handleExerciseClicked={handleExerciseClicked}
                />
              ))}
            </div>
          ) : (
            <h1 className="add_now">Add Exercises Now! 💪🏾</h1>
          )}
        </div>
        <button onClick={toggleAddExercise} className="add_btn">
          Add Exercise
        </button>
        {addExerciseOpen ? (
          <Popup
            prompt="Add An Exercise!"
            option="Add"
            handleCancelCLicked={toggleAddExercise}
            handleOptionCLicked={handleNewExerciseSaved}
          >
            <div className="exercise_popup-children">
              <div className="popup-exercise">
                <label>Exercise: </label>
                <input
                  id="popupexerciseinput"
                  size="0"
                  type="text"
                  placeholder="Exercise.."
                  value={popupExercise}
                  onChange={(e) => setPopupExercise(e.target.value)}
                ></input>
              </div>

              <div className="popup-stat">
                <label>Sets:</label>
                <input
                  className="stat_input"
                  type="text"
                  placeholder="0"
                  maxLength={3}
                  value={popupSets}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setPopupSets(isNaN(value) ? "" : value);
                  }}
                ></input>
              </div>

              <div className="popup-stat">
                <label>Reps:</label>
                <input
                  className="stat_input2"
                  type="text"
                  placeholder="0"
                  maxLength={3}
                  value={popupReps}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setPopupReps(isNaN(value) ? "" : value);
                  }}
                ></input>
              </div>
              {popupError !== "" ? (
                <div className="error">{popupError}</div>
              ) : null}
            </div>
          </Popup>
        ) : null}

        {deleteOpen ? (
          <Popup
            prompt={`Delete ${exerciseBeinglookedAt}?`}
            option="Delete"
            handleCancelCLicked={toggleDeleteExercise}
            handleOptionCLicked={handleDeleteExercise}
          >
            <div className="delete_popup-children">
              <p style={{ color: "red" }}>
                Are you sure you want to delete your {exerciseBeinglookedAt}{" "}
                exercise?
              </p>{" "}
              <p style={{ color: "red" }}>
                All related Data from other days will be lost!
              </p>
            </div>
          </Popup>
        ) : null}

        {renameOpen ? (
          <Popup
            prompt={`Rename ${exerciseBeinglookedAt}?`}
            option="Rename"
            handleCancelCLicked={toggleRenameExercise}
            handleOptionCLicked={handleRenameExercise}
          >
            <div className="popup-new_name">
              <label className="newNameLabel">New Name </label>
              <input
                type="text"
                placeholder="New.."
                value={popupNewName}
                onChange={(e) => setPopupNewName(e.target.value)}
              ></input>
            </div>

            <div className="rename_popup-children">
              {popupError !== "" ? (
                <div className="error">{popupError}</div>
              ) : null}
            </div>
          </Popup>
        ) : null}
      </div>
    </div>
  );
}

export default Workouts;
