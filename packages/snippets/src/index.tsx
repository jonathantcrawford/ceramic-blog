import * as React from 'react'
interface Props {
  text: string
}

export const ExampleComponent = ({ text }: Props) => {
  return (
    <div className='mx-auto max-w-sm space-y-2 rounded-xl bg-blue py-8 px-8 shadow-lg sm:flex sm:items-center sm:space-y-0 sm:space-x-6 sm:py-4'>
      Example Component: {text}
    </div>
  )
}
