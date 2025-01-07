import React from 'react'
import ViewPresentation from '../components/presentation-view/ViewPresentation'
import Navbar from '../components/shared/Navbar'

const PresentationViewPage: React.FC = () => {
  return (<>
       <Navbar showHistoryId={true} showOrganizationProfileId={true} />
      <ViewPresentation />
    </>
  )
}

export default PresentationViewPage
