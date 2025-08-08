import React, { useContext } from 'react'
import { UserContext } from '../../context/userContext'
import Navbar from './Navbar'
import SideMenu from './SideMenu'

const DashboardLayout = ({children, activeMenu}) => {
    const { user } = useContext(UserContext);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-purple-50">
        <Navbar activeMenu = {activeMenu} />

        {user && (
            <div className="flex">
                <div className="max-[1080px]:hidden">
                    <SideMenu activeMenu={activeMenu} />
                </div>

                <div className="grow mx-5 my-6 max-w-7xl mx-auto">
                    <div className="px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}

export default DashboardLayout