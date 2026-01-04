"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  id: string;
  email: string;
  username: string;
  role: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    projects: number;
  };
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create user modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    email: "",
    username: "",
    password: "",
    role: "user" as "user" | "admin",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Edit user modal
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({
    email: "",
    username: "",
    role: "user" as "user" | "admin",
    password: "",
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUsers = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
      });
      if (search) {
        params.set("search", search);
      }

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setUsers(data.users);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "사용자 목록을 불러올 수 없습니다");
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(1);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError(null);

    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setShowCreateModal(false);
      setCreateForm({ email: "", username: "", password: "", role: "user" });
      fetchUsers();
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "사용자 생성 실패");
    } finally {
      setIsCreating(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    setIsEditing(true);
    setEditError(null);

    try {
      const updateData: Record<string, string> = {
        email: editForm.email,
        username: editForm.username,
        role: editForm.role,
      };
      if (editForm.password) {
        updateData.password = editForm.password;
      }

      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      setEditingUser(null);
      fetchUsers();
    } catch (err) {
      setEditError(err instanceof Error ? err.message : "사용자 수정 실패");
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("정말로 이 사용자를 삭제하시겠습니까? 모든 프로젝트도 함께 삭제됩니다.")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error);
      }

      fetchUsers();
    } catch (err) {
      alert(err instanceof Error ? err.message : "사용자 삭제 실패");
    }
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditForm({
      email: user.email,
      username: user.username,
      role: user.role as "user" | "admin",
      password: "",
    });
    setEditError(null);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              관리자 대시보드
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">
              {session?.user?.name} ({session?.user?.email})
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => router.push("/change-password")}
            >
              비밀번호 변경
            </Button>
            <Button
              variant="outline"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              로그아웃
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              전체 사용자
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {pagination?.total || 0}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              관리자
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {users.filter((u) => u.role === "admin").length}
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              전체 프로젝트
            </div>
            <div className="text-3xl font-bold text-slate-900 dark:text-white mt-1">
              {users.reduce((acc, u) => acc + u._count.projects, 0)}
            </div>
          </div>
        </div>

        {/* Search & Actions */}
        <div className="flex justify-between items-center mb-6">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              placeholder="이메일 또는 사용자명 검색..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button type="submit" variant="outline">
              검색
            </Button>
          </form>
          <Button onClick={() => setShowCreateModal(true)}>
            + 사용자 추가
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  사용자
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  역할
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  가입 방법
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  프로젝트
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  가입일
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  작업
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    로딩 중...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    사용자가 없습니다
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900 dark:text-white">
                        {user.username}
                      </div>
                      <div className="text-sm text-slate-500 dark:text-slate-400">
                        {user.email}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
                            : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {user.role === "admin" ? "관리자" : "사용자"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {user.provider === "email"
                        ? "이메일"
                        : user.provider === "google"
                        ? "Google"
                        : user.provider}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-900 dark:text-white">
                      {user._count.projects}개
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("ko-KR")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          수정
                        </Button>
                        {user.id !== session?.user?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            삭제
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 p-4 border-t border-slate-100 dark:border-slate-700">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === pagination.page ? "default" : "outline"}
                    size="sm"
                    onClick={() => fetchUsers(page)}
                  >
                    {page}
                  </Button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 사용자 추가</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateUser} className="space-y-4 mt-4">
            {createError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {createError}
              </div>
            )}
            <div>
              <Label htmlFor="create-email">이메일</Label>
              <Input
                id="create-email"
                type="email"
                value={createForm.email}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="create-username">사용자명</Label>
              <Input
                id="create-username"
                value={createForm.username}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, username: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="create-password">비밀번호</Label>
              <Input
                id="create-password"
                type="password"
                value={createForm.password}
                onChange={(e) =>
                  setCreateForm((prev) => ({ ...prev, password: e.target.value }))
                }
                required
                minLength={8}
              />
            </div>
            <div>
              <Label htmlFor="create-role">역할</Label>
              <select
                id="create-role"
                value={createForm.role}
                onChange={(e) =>
                  setCreateForm((prev) => ({
                    ...prev,
                    role: e.target.value as "user" | "admin",
                  }))
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="user">사용자</option>
                <option value="admin">관리자</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isCreating}>
                {isCreating ? "생성 중..." : "생성"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Edit User Modal */}
      <Dialog open={!!editingUser} onOpenChange={() => setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 수정</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditUser} className="space-y-4 mt-4">
            {editError && (
              <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
                {editError}
              </div>
            )}
            <div>
              <Label htmlFor="edit-email">이메일</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, email: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-username">사용자명</Label>
              <Input
                id="edit-username"
                value={editForm.username}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, username: e.target.value }))
                }
                required
              />
            </div>
            <div>
              <Label htmlFor="edit-password">
                새 비밀번호 (변경 시에만 입력)
              </Label>
              <Input
                id="edit-password"
                type="password"
                value={editForm.password}
                onChange={(e) =>
                  setEditForm((prev) => ({ ...prev, password: e.target.value }))
                }
                minLength={8}
                placeholder="변경하지 않으려면 비워두세요"
              />
            </div>
            <div>
              <Label htmlFor="edit-role">역할</Label>
              <select
                id="edit-role"
                value={editForm.role}
                onChange={(e) =>
                  setEditForm((prev) => ({
                    ...prev,
                    role: e.target.value as "user" | "admin",
                  }))
                }
                className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
              >
                <option value="user">사용자</option>
                <option value="admin">관리자</option>
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingUser(null)}
              >
                취소
              </Button>
              <Button type="submit" disabled={isEditing}>
                {isEditing ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
