import React,{useState} from 'react'
import { useDispatch } from 'react-redux'
import { signup } from '../redux/action'



const Signup = () => {

    const [name, setname] = useState('')
    const [email, setemail] = useState('')
    const [password, setpassword] = useState('')
    const [phone, setphone] = useState('')
     
    const dispatch=useDispatch()

    const changename =(e)=>{

   
        setname(e.target.value)
        
        
      };
    

      const changeemail =(e)=>{
        setemail(e.target.value)
        
      };
      const changepass =(e)=>{
        setpassword(e.target.value)
        
      };

      const changephone =(e)=>{
        setphone(e.target.value)
        
      };
    
    
    

    const submit=async()=>{
     var  obj={
        name:name,
        email:email,
        password: password,
        mobile:phone,
      }
      console.log(obj)



  await dispatch(signup(obj)).then(response=>{
     console.log(response)
  })



      

    
      setname('')
      setemail('')
      setpassword('')

      setphone('')
     
    }

  return (
    <div>
        <p>Signup</p>

        <br />
      <br />
      <br />
      <br />
      Name:
      <input onChange={changename} value={name}/>
      <br />
      <br />
      <br />
      <br />
      Email:
      <input onChange={changeemail}  value={email} />
      <br />
      <br />
      <br />
      <br />
      password:
      <input onChange={changepass} value={ password
}/>
      <br />
      <br />
      <br />
      <br />
      phone:
      <input onChange={changephone}  value={phone} />
      <button onClick={submit}>Submit</button>
    </div>
  )
}

export default Signup