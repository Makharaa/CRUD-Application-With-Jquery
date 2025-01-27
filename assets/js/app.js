let users = JSON.parse(localStorage.getItem('users')) || [];
let editIndex = null;

let user = {}

const tableColumns = [
    {
        title: 'S.No',
        field: 'index',
    },
    {
        title: 'Picture',
        field: 'picture',
        template: (value) => ` <img src="${value || 'assets/images/default-avatar.png'}" alt="User" style="object-fit: cover;width: 50px; height: 50px;">`
    },
    {
        title: 'Name',
        field: 'name',
    },
    {
        title: 'Age',
        field: 'age',
    },
    {
        title: 'City',
        field: 'city',
    },
    {
        title: 'Email',
        field: 'email',
    },
    {
        title: 'Phone',
        field: 'phone',
    },
    {
        title: 'Post',
        field: 'post',
    },
    {
        title: 'Start Date',
        field: 'startDate',
    },
    {
        title: 'Action',
        field: 'action',
        template: (el, row, index) => `
            <button class="btn btn-success viewUser" data-index="${index}">View</button>
            <button class="btn btn-primary editUser" data-index="${index}">Edit</button>
            <button class="btn btn-danger deleteUser" data-index="${index}">Delete</button>
        `
    }
]

// Table component definition
$.fn.tableComponent = function ({ columns, data }) {
    data = data.map((e, index) => ({ ...e, index: index + 1 }));

    const container = $(this);

    function renderTable() {
        container.empty();

        const table = $('<table></table>');
        const thead = $('<thead></thead>');
        const headerRow = $('<tr></tr>');

        columns.forEach(col => {
            const th = $('<th></th>').text(col.title);
            headerRow.append(th);
        });
        table.append(headerRow);
        table.append(thead);

        const tbody = $('<tbody></tbody>');
        data.forEach((row, index) => {
            const tr = $('<tr></tr>');
            columns.forEach(col => {
                const content = col.template ? col.template(row[col.field], row, index) : row[col.field];
                tr.append($('<td></td>').html(content));
            });
            tbody.append(tr);
        });
        table.append(tbody);
        container.html(table);
    }

    renderTable();

    return {
        refresh(newData) {
            data = [...newData.map((e, index) => ({ ...e, index: index + 1 }))];
            renderTable();
        }
    };
};

const userTable = $('.user-table').tableComponent({
    columns: tableColumns,
    data: users
})

//ModalBox Open
$("#newUser").click(function () {
    $("#userForm")[0].reset();
    $("#previewImage").attr("src", "assets/images/default-avatar.png");
    editIndex = null;
    $("#userModal").addClass("show");
});
//ModalBox Close
$(".close-btn").click(function () {
    $("#userModal").removeClass("show");
    $("#userForm input").prop("disabled", false);
    $("#userPicture").show();
    $(".btn-submit").show();
});

//Add Items
$("#userForm").submit(function (e) {
    e.preventDefault();
    $(this).serializeArray().forEach(el => user[el.name] = el.value || '-')
    if (editIndex !== null) {
        users[editIndex] = user
    } else {
        users.push(user)
    }

    localStorage.setItem("users", JSON.stringify(users));
    userTable.refresh(users)
    $("#userModal").removeClass("show");
});

$("#userPicture").change(function (e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (event) {
            $("#previewImage").attr("src", event.target.result);
            user.picture = event.target.result
        };
        reader.readAsDataURL(file);
    }
});

function setFieldValues(user, disabled) {
    $('input', '#userForm').each((index, el) => {
        const field = $(el).attr('name')
        $(el).val(user[field]).prop('disabled', disabled)
    })
}

//EditItem
$(document).on("click", ".editUser", function () {
    editIndex = $(this).data("index");
    user = users[editIndex];
    $("#previewImage").attr("src", user.picture || "assets/images/default-avatar.png");

    setFieldValues(user, false)

    localStorage.setItem("users", JSON.stringify(users));
    userTable.refresh(users)
    $("#userModal").addClass("show");
});

//RemoveItem
$(document).on("click", ".deleteUser", function () {
    const index = $(this).data("index");
    users.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(users))
    userTable.refresh(users)
});

//View
$(document).on("click", ".viewUser", function () {
    const index = $(this).data("index");
    const user = users[index];

    $("#previewImage").attr("src", user.picture || "assets/images/default-avatar.png");
    setFieldValues(user, true)
    $("#userPicture").hide();
    $(".btn-submit").hide();
    $("#userModal").addClass("show");
});
