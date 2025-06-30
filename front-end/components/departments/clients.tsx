'use client'
import React from 'react'
import { Plus, ChevronDown, Search, Notebook, NotebookPen, Edit } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import AddClientForm from '../add-client-form'





function Clients() {
  // Sample data
  const users = [
    { id: 1, name: 'Alex Johnson', email: 'alex@example.com', role: 'Admin', status: 'active', lastLogin: '2h ago', avatar: '/avatars/01.png' },
    { id: 2, name: 'Maria Garcia', email: 'maria@example.com', role: 'Editor', status: 'active', lastLogin: '5h ago', avatar: '/avatars/02.png' },
    { id: 3, name: 'David Kim', email: 'david@example.com', role: 'Developer', status: 'inactive', lastLogin: '1d ago', avatar: '/avatars/03.png' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Viewer', status: 'active', lastLogin: '30m ago', avatar: '/avatars/04.png' },
  ]

  return (
    <div className="px-5 mt-5  mx-auto">
      {/* Header with search and action */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Clients list</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Manage your clients
          </p>
        </div>
        
        <div className="flex gap-3">
         <AddClientForm/>

        </div>
      </div>

      {/* Modern Card Table */}
<div className="dark:bg-gray-900 rounded-lg border  dark:border-gray-800 overflow-hidden">
  {/* Table Header - 8 columns (using col-span-2 for each) */}
  <div className="grid grid-cols-10 gap-4 px-6 py-3  dark:bg-gray-800 border-b border-gray-200 dark:border-gray-800">
    <div className="col-span-2 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
      Client name
    </div>
    <div className="col-span-3 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
      Niche
    </div>
    <div className="col-span-3 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
      Email
    </div>
    <div className="col-span-1 flex items-center text-sm font-medium text-gray-500 dark:text-gray-400">
      number
    </div>

    <div className="col-span-1 flex justify-end text-sm font-medium text-gray-500 dark:text-gray-400">
      
    </div>
  </div>

  {/* Table Rows */}
  <div className="divide-y  dark:divide-gray-800 justify-between">
    {users.map((user) => (
      <div key={user.id} className="grid grid-cols-10 gap-4 px-6 py-4  dark:hover:bg-gray-800/50 transition-colors">
        {/* Fullname */}
        <div className="col-span-2 flex items-center">
          <p className="font-medium text-gray-900 dark:text-white">{user.name}</p>
        </div>
        
        {/* Fullname */}
        <div className="col-span-3 flex items-center">
          <span className="text-sm text-gray-900 dark:text-white">{user.name}</span>
        </div>
        
        {/* Email */}
        <div className="col-span-3 flex items-center">
          <span className="text-sm text-gray-900 dark:text-white">{user.email}</span>
        </div>
        
        {/* Role */}
        <div className="col-span-1 flex items-center">
          <span className="text-sm text-gray-900 dark:text-white">{user.role}</span>
        </div>
        
       
        {/* Actions */}
    
        <div className="col-span-1 flex items-center justify-center">
          <Edit className="h-4 w-4" />
        </div>
      </div>
    ))}
  </div>

  {/* Table Footer */}
  <div className="px-6 py-3  dark:bg-gray-800 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
    <p className="text-sm text-gray-500 dark:text-gray-400">
      Showing <span className="font-medium">1</span> to <span className="font-medium">4</span> of <span className="font-medium">24</span> users
    </p>
    <div className="flex gap-2">
      <Button variant="outline" size="sm">
        Previous
      </Button>
      <Button variant="outline" size="sm">
        Next
      </Button>
    </div>
  </div>
</div>
    </div>
  )
}

export default Clients