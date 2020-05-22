import React, {useEffect, useState, FormEvent} from 'react';
import {Redirect} from 'react-router-dom'


// interface for Class database
interface ClassModel {
  _id: number;
  classname:  string;
  subject:    string;
  teacher:   string;
  students:   Array<string>;
  assignments: Array<string>;
  startdate:  Date;
  enddate:    Date;
}
// interface for Student database
interface StudentModel {
  firstname:  string;
  lastname:    string;
  position:   string;
  _id: number;
}


interface PropsInt {
  user: {
      firstname: string,
      pic: string,
      position: string,
      _id: string
  }
}

const NewHW : React.FC<PropsInt> = (props) =>{

    let [message, setMessage] =  React.useState<String | null>(null);
    //states for holding database information
    let [allClasses, setAllClasses] = React.useState<ClassModel[]>([])
    let [allUsers, setAllUsers] = React.useState<StudentModel[]>([])
    let [classId, setClass] =  useState('') 
    let [teacher, setTeacher] = useState('')
    let [question, setQuestion] = useState('')
    let [dateAssigned, setDateAssigned] = useState('')
    let [dateDue, setDateDue] = useState('')
    let [students, setStudent] = useState('')
    

    useEffect(() => {

      //calls the database for all Classes
      const callClassApi =()=>{
        fetch(process.env.REACT_APP_SERVER_URL + 'classes')
        .then(response=> response.json())
        .then(data =>{
        console.log(data)
        setAllClasses(data)
        })
        .catch(err=>{
        console.log("error fetching classes",err)
        })
      }

     
      if(props.user ){
        let  userStr = props.user.position.toLowerCase()
        if(userStr == 'teacher'){
            // call the api functions at component load
             callClassApi()
    
            setTeacher(props.user._id)
        }
    }
    }, [])

    if(!props.user) {
      return <Redirect to='/login'/>
    }
    let userStr = props.user.position.toLowerCase() 
    if(userStr !== "teacher"){
      return <Redirect to='/profile'/>
    }

    //map function for option tags
    let allClassOptions = allClasses.map((allc, i) => {
        return (
            <option value={allc._id}>{allc.classname}</option>
        )
    })

    let studentMap = allUsers.map((allu, i) => {
        console.log("student id: ", allu._id)
        return (
          <option value={allu._id}>{allu.firstname}</option>
          )
    })



    const handleSubmit = (e: FormEvent) => {
      e.preventDefault()
      
      console.log("teacher: ",  teacher)
      console.log("students: ",  students)
      console.log("question: ",  question)
      console.log("due Date: ", dateDue)
      console.log("due Date: ", dateAssigned)

      fetch(process.env.REACT_APP_SERVER_URL + 'assignments/class/' + classId, {
        method: 'POST',
        body: JSON.stringify({
          question,
          dateDue,
          dateAssigned,
          teacher
        }),
        headers: {
          'Content-Type' : 'application/json'
      }
      })
      .then(response=>{
            console.log("Here is the response!", response)
            if (!response.ok){
            setMessage(`${response.status} : ${response.statusText}`)
            return
            }
            response.json().then(result => {
            console.log("result!", result)
              
            })
        })
        .catch(err => {
            console.log('error in adding new class by teacher', err)
        })
        .finally(()=>{
          
        })
  }

   return(
          <div>
                 <h2>Create New Assignment</h2>
                <span className="red">{message}</span>
                    <form onSubmit={handleSubmit}>    
                        <div>
                        <label>Classname:</label>
                          <select name="class" value= {classId} onChange={(e: any) => {
                            setTeacher(props.user._id)
                            setClass(e.target.value)} }>
                           <option value="null" selected>Select Class</option>
                            {allClassOptions}
                          
                          </select>
                        </div>

                        <div>
                          <input type="hidden" name="teacher" value={teacher}></input>
                        </div>

                        <div> 
                        <label>Date Assigned:</label>
                          <input name="dateAssigned" type="date" value={dateAssigned} onChange={e => setDateAssigned(e.target.value)}></input>
                        </div>
                        
                        <div>
                        <label>Due Date:</label> 
                          <input name="dateDue" type="date" value={dateDue} onChange={e => setDateDue(e.target.value)}></input>
                        </div>

                        <div>
                        <label>Question</label> 
                          <input name="question" type="text" value={question} onChange={e => {
                            setQuestion(e.target.value)
                          }} required></input>
                        </div>
                         
                        <button type="submit">Add Assignment</button>
                    </form>
          </div>
        )
    }

export default NewHW 