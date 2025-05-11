import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import axios from 'axios';
import Swal from 'sweetalert2';

function CategoryModal({ open, onClose }) {
  const [categories, setCategories] = useState([]);
  const [newName, setNewName] = useState('');
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState('');

  const fetchCategories = () => {
    axios.get('/api/v1/category/getAll')
      .then(res => {
        setCategories(Array.isArray(res.data) ? res.data : []);
      });
  };

  useEffect(() => {
    if (open) fetchCategories();
  }, [open]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    axios.post('/api/v1/category/saveOrUpdate', { categoryName: newName })
      .then(() => {
        setNewName('');
        fetchCategories();
        Swal.fire('Thành công', 'Đã thêm danh mục', 'success');
      })
      .catch(() => Swal.fire('Lỗi', 'Không thể thêm danh mục', 'error'));
  };

  const handleEdit = (cat) => {
    setEditId(cat.id);
    setEditName(cat.categoryName);
  };

  const handleSaveEdit = () => {
    if (!editName.trim()) return;
    axios.post('/api/v1/category/saveOrUpdate', { id: editId, categoryName: editName })
      .then(() => {
        setEditId(null);
        setEditName('');
        fetchCategories();
        Swal.fire('Thành công', 'Đã cập nhật danh mục', 'success');
      })
      .catch(() => Swal.fire('Lỗi', 'Không thể cập nhật danh mục', 'error'));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Quản lý danh mục</DialogTitle>
      <DialogContent>
        <Stack direction="row" spacing={2} mb={2}>
          <TextField
            label="Tên danh mục mới"
            value={newName}
            onChange={e => setNewName(e.target.value)}
            fullWidth
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleAdd}>
            Thêm
          </Button>
        </Stack>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên danh mục</TableCell>
              <TableCell align="right">Chức năng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map(cat => (
              <TableRow key={cat.id}>
                <TableCell>{cat.id}</TableCell>
                <TableCell>
                  {editId === cat.id ? (
                    <TextField
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      size="small"
                      autoFocus
                    />
                  ) : (
                    cat.categoryName
                  )}
                </TableCell>
                <TableCell align="right">
                  {editId === cat.id ? (
                    <Button size="small" variant="contained" onClick={handleSaveEdit}>
                      Lưu
                    </Button>
                  ) : (
                    <IconButton onClick={() => handleEdit(cat)}><EditIcon /></IconButton>
                  )}
                  {/* Chưa có API xóa nên chỉ hiển thị nếu backend bổ sung */}
                  {/* <IconButton color="error" onClick={() => handleDelete(cat.id)}><DeleteIcon /></IconButton> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryModal; 