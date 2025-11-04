import React from 'react'

export default function Table({columns, data}){
  return (
    <div className="overflow-x-auto card">
      <table className="min-w-full divide-y">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((c)=> <th key={c} className="px-4 py-2 text-left text-sm font-medium text-gray-600">{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.length===0 && (
            <tr><td className="px-4 py-6 text-sm text-gray-500" colSpan={columns.length}>No records</td></tr>
          )}
          {data.map((row, idx)=>(
            <tr key={idx} className={idx%2? 'bg-white':'bg-gray-50'}>
              {columns.map((c)=> <td key={c} className="px-4 py-3 text-sm text-gray-700">{row[c] ?? '-'}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
