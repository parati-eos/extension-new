import React from 'react'
import ViewPresentation from '../components/presentation-view/ViewPresentation'
import Navbar from '../components/shared/Navbar'

const PresentationViewPage: React.FC = () => {
  return (<>
  <div className='overflow-hidden h-dvh'>
       <Navbar showHistoryId={true} showOrganizationProfileId={true} />
      <ViewPresentation />
      </div>
    </>
  )
}

export default PresentationViewPage
