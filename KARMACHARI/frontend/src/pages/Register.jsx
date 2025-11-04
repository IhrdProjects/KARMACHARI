import React, {useState} from 'react'

export default function Register(){
  const [role, setRole] = useState('student')
  const [form, setForm] = useState({})

  function handle(e){
    setForm({...form, [e.target.name]: e.target.value})
  }

  function submit(e){
    e.preventDefault()
    alert('Demo registration captured — Enrollment: ENR-'+Math.floor(Math.random()*90000+10000))
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="hero">
        <h1 className="text-2xl font-bold text-govblue mb-2">Register</h1>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Role</label>
            <select name="role" value={role} onChange={e=>setRole(e.target.value)} className="mt-1 border rounded px-3 py-2 w-full">
              <option value="student">Student</option>
              <option value="principal">Principal</option>
              <option value="employer">Employer</option>
              <option value="alo">Assistant Labour Officer</option>
            </select>
          </div>

          {role === 'student' && (
            <>
              <div>
                <label className="block text-sm font-medium">Full name</label>
                <input name="name" onChange={handle} className="mt-1 border rounded px-3 py-2 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium">School / College</label>
                  <input name="institution" onChange={handle} className="mt-1 border rounded px-3 py-2 w-full" />
                </div>
                <div>
                  <label className="block text-sm font-medium">Parent/Guardian name</label>
                  <input name="parent" onChange={handle} className="mt-1 border rounded px-3 py-2 w-full" />
                </div>
              </div>
            </>
          )}

          {role === 'employer' && (
            <>
              <div>
                <label className="block text-sm font-medium">Organization name</label>
                <input name="org" onChange={handle} className="mt-1 border rounded px-3 py-2 w-full" />
              </div>
            </>
          )}

          <div className="flex justify-end">
            <button className="btn-primary">Register</button>
          </div>
        </form>
      </div>
    </div>
  )
}
