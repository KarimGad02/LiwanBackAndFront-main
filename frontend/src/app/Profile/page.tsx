import { Label } from '@radix-ui/react-label'
import React from 'react'
import { Input } from '../components/ui/input'

const PersonalInformationForm = () => {

  return (
    <form className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="form-control flex flex-col">
          <Label htmlFor="name" className="mb-2 font-medium">
            Employee Name
          </Label>
          <Input
            id="name"
            type="text"
            value="dfsc"
            disabled
            aria-readonly="true"
          />
        </div>
        <div className="form-control flex flex-col">
          <Label htmlFor="email" className="mb-2 font-medium">
            Employee Email
          </Label>
          <Input
            id="email"
            type="email"
            value="sdaads"
            disabled
            aria-readonly="true"
          />
        </div>
        <div className="form-control flex flex-col">
          <Label htmlFor="extension" className="mb-2 font-medium">
            Employee Extension
          </Label>
          <Input
            id="extension"
            type="text"
            value="asdsad"
            disabled
            aria-readonly="true"
          />
        </div>
      </div>
    </form>
  )
}
