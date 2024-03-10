import React from 'react'
import PageContent from '@/components/Layout/PageContent'
import { Box, Text, Button, Heading } from '@chakra-ui/react'
import Profile from '@/components/Profile/Profile'
import UserPosts from '@/components/Profile/UserPosts'
import { auth } from '@/firebase/clientApp'
import { useAuthState } from 'react-firebase-hooks/auth'
import withAuth from '@/utils/withAuth'

const ProfilePage: React.FC = () => {

  const [user] = useAuthState(auth);
  return (
    
    <PageContent>
      <>
      <Box 
      borderRadius={5}
      bg="#0F3320" 
      m="0px 10px 10px 10px" 
      alignSelf="flex-start" 
      alignItems="center">
        <Heading as="h2" size="" m="10px" color="white">
          My Post
        </Heading>
      </Box>
      
      <UserPosts />
      </>
     {user && <Profile user={user}/>} 
    </PageContent>

  )
}

export default withAuth(ProfilePage);

