
import { useAuth } from '../navigation/AuthContext'
import { useGetProfileQuery } from '../store/services/user/userApi'
import { useEffect } from 'react'


export function ProfileChecker() {
  const { logout } = useAuth()
  const { error, isError } = useGetProfileQuery({})
  useEffect(() => {
    if (isError && error) {
      const status = (error as any)?.status
      if ([401, 403, 404].includes(status)) {
        logout()
      }
    }
  }, [error, isError, logout])

  return null
}