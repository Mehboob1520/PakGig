<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Reset Password - PakGig</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-50 flex items-center justify-center min-h-screen py-12 px-4">
  <div class="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
    <div class="text-center mb-6">
      <a href="index.html" class="text-3xl font-extrabold text-emerald-700 tracking-tight">Pak<span class="text-gray-900">Gig</span></a>
      <h2 class="mt-3 text-xl font-bold text-gray-900">Reset password</h2>
    </div>

    <div id="alertBox" class="hidden p-3 rounded-lg text-xs font-medium border"></div>

    <form id="resetForm" class="space-y-4">
      <div>
        <label class="block text-xs font-semibold text-gray-700 mb-1">New password</label>
        <input type="password" id="newPassword" required class="w-full px-3.5 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none" />
      </div>
      <button type="submit" id="resetBtn" class="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold rounded-lg shadow-md transition">Update password</button>
    </form>
  </div>

  <script type="module">
    import { supabase } from './js/supabaseClient.js';

    const form = document.getElementById('resetForm');
    const alertBox = document.getElementById('alertBox');
    const resetBtn = document.getElementById('resetBtn');

    function showAlert(type, message) {
      const styles = type === 'success'
        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
        : 'bg-red-50 border-red-200 text-red-800';
      alertBox.className = 'p-3 rounded-lg text-xs font-medium border block ' + styles;
      alertBox.textContent = message;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      resetBtn.disabled = true;
      resetBtn.textContent = 'Updating...';
      const { error } = await supabase.auth.updateUser({
        password: document.getElementById('newPassword').value
      });

      if (error) {
        showAlert('error', error.message || 'Reset failed.');
        resetBtn.disabled = false;
        resetBtn.textContent = 'Update password';
      } else {
        showAlert('success', 'Password updated successfully. You can now sign in.');
        setTimeout(() => window.location.href = 'login.html', 800);
      }
    });
  </script>
</body>
</html>
