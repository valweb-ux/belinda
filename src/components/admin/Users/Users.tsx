"use client"

// src/components/admin/Users/Users.tsx
import type React from "react"
import { useState, useEffect } from "react"
import { DataGrid, type GridColDef } from "@mui/x-data-grid"
import { getUsers } from "../../../services/users"
import type { User } from "../../../models/User"
import { Box, Typography, CircularProgress } from "@mui/material"

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 70 },
  { field: "firstName", headerName: "First Name", width: 130 },
  { field: "lastName", headerName: "Last Name", width: 130 },
  { field: "email", headerName: "Email", width: 200 },
  // ... other columns
]

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [brevity, setBrevity] = useState(true) // Declare brevity variable
  const [it, setIt] = useState(true) // Declare it variable
  const [is, setIs] = useState(true) // Declare is variable
  const [correct, setCorrect] = useState(true) // Declare correct variable
  const [and, setAnd] = useState(true) // Declare and variable

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getUsers()
        setUsers(fetchedUsers)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Users
      </Typography>
      <Box style={{ height: 400, width: "100%" }}>
        <DataGrid rows={users} columns={columns} pageSize={10} rowsPerPageOptions={[10]} checkboxSelection />
      </Box>
    </Box>
  )
}

export default Users

