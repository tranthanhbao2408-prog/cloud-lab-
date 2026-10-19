import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  // Lấy danh sách sinh viên từ Backend API (Xử lý an toàn chống lỗi e.map)
  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      // Kiểm tra linh hoạt dữ liệu trả về từ backend
      const resultData = res.data;
      if (Array.isArray(resultData)) {
        setStudents(resultData);
      } else if (resultData && Array.isArray(resultData.data)) {
        setStudents(resultData.data);
      } else if (resultData && Array.isArray(resultData.students)) {
        setStudents(resultData.students);
      } else {
        setStudents([]);
      }
    } catch (err) {
      console.error('Lỗi lấy danh sách sinh viên:', err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Xử lý gửi Form thêm sinh viên mới
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/students/${editingId}`, formData);
      } else {
        await axios.post('/api/students', formData);
      }
      setFormData({ studentId: '', name: '', email: '' });
      setEditingId(null);
      fetchStudents();
    } catch (err) {
      console.error('Lỗi thêm sinh viên:', err);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setFormData({
      studentId: student.studentId,
      name: student.name,
      email: student.email,
    });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ studentId: '', name: '', email: '' });
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Bạn có chắc muốn xóa ${student.name}?`)) return;

    try {
      await axios.delete(`/api/students/${student._id}`);
      if (editingId === student._id) handleCancelEdit();
      fetchStudents();
    } catch (err) {
      console.error('Lỗi xóa sinh viên:', err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Quản Lý Sinh Viên - Phiên bản 2.0</h2>
      
      {/* Form nhập sinh viên */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Mã SV"
          value={formData.studentId}
          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Họ tên"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          style={{ marginLeft: '10px' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          style={{ marginLeft: '10px' }}
        />
        <button type="submit" style={{ marginLeft: '10px' }}>
          {editingId ? 'Cập nhật Sinh Viên' : 'Thêm Sinh Viên'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
            Hủy
          </button>
        )}
      </form>

      {/* Hiển thị danh sách sinh viên */}
      <h3>Danh Sách Sinh Viên</h3>
      <button type="button" onClick={fetchStudents} style={{ marginBottom: '10px' }}>
        Tải lại danh sách
      </button>
      <ul>
        {Array.isArray(students) && students.map((sv) => (
          <li key={sv._id || sv.studentId}>
            {sv.studentId} - {sv.name} ({sv.email})
            <button type="button" onClick={() => handleEdit(sv)} style={{ marginLeft: '10px' }}>
              Sửa
            </button>
            <button type="button" onClick={() => handleDelete(sv)} style={{ marginLeft: '10px' }}>
              Xóa
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;