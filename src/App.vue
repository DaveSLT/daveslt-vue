<template>
  <v-app>
    <v-container class="py-5" fluid>
      <v-row justify="center">
        <v-col cols="12" sm="10" md="10">
          <v-card outlined class="pa-5">
            <!-- Header: Current Date and Time -->
            <v-row justify="center" class="mb-4">
              <v-col class="text-center">
                <h2>{{ currentDateTime }}</h2>
              </v-col>
            </v-row>

            <!-- Category Filter Section -->
            <v-row justify="center" class="mb-4">
              <v-col cols="12" sm="8">
                <v-select
                  v-model="taskFilter"
                  :items="['All', 'Important', 'Not Important']"
                  label="Filter Tasks"
                  outlined
                  dense
                ></v-select>
              </v-col>
            </v-row>

            <!-- Add Task Section -->
            <v-row align="center" class="mb-4 addtask1">
              <v-col cols="12" sm="9" class="addinput">
                <v-text-field
                  v-model="newTask"
                  label="Add a new task"
                  @keyup.enter="addTask"
                  outlined
                  dense
                ></v-text-field>
              </v-col>
              <v-col cols="12" sm="3" class="addbtn">
                <!-- Adjusted to 12 cols for small screens -->
                <v-btn @click="addTask" color="primary" block>Add Task</v-btn>
              </v-col>
            </v-row>

            <!-- Task List -->
            <v-list>
              <v-list-item
                v-for="(task, index) in filteredTasks"
                :key="index"
                class="task-item justify-space-between"
              >
                <v-card outlined class="w-100">
                  <v-row
                    align="center"
                    class="px-3 py-2"
                    style="background-color: #f0f8ff"
                  >
                    <!-- Checkbox for Done/Not Done -->
                    <v-col cols="auto">
                      <v-btn
                        icon
                        @click="toggleDone(index)"
                        :color="task.isDone ? 'success' : 'grey'"
                        class="hover-highlight"
                      >
                        <v-icon>
                          {{
                            task.isDone
                              ? "mdi-check-circle"
                              : "mdi-circle-outline"
                          }}
                        </v-icon>
                      </v-btn>
                    </v-col>

                    <!-- Task Text or Edit Input -->
                    <v-col class="d-flex align-center" style="flex-grow: 1">
                      <div
                        v-if="!task.isEditing"
                        :class="{ done: task.isDone }"
                      >
                        {{ task.text }}
                      </div>
                      <v-textarea
                        v-else
                        v-model="task.editText"
                        outlined
                        auto-grow
                        dense
                      ></v-textarea>
                    </v-col>

                    <!-- Action Buttons (Star, Edit/Save, Delete) -->
                    <v-col cols="auto" class="d-flex justify-end align-center">
                      <v-btn icon @click="toggleImportant(index)">
                        <v-icon :color="task.isImportant ? 'orange' : 'grey'"
                          >mdi-star</v-icon
                        >
                      </v-btn>

                      <v-btn
                        v-if="!task.isEditing"
                        icon
                        class="action-btn hover-highlight"
                        @click="editTask(index)"
                      >
                        <v-icon>mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn
                        v-else
                        color="success"
                        icon
                        class="action-btn hover-highlight"
                        @click="saveTask(index)"
                      >
                        <v-icon>mdi-content-save</v-icon>
                      </v-btn>

                      <v-btn
                        icon
                        class="action-btn hover-highlight"
                        @click="confirmDeleteTask(index)"
                      >
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-btn>
                    </v-col>
                  </v-row>

                  <!-- Creation and Modification Dates -->
                  <v-col cols="12" class="task-dates">
                    <small
                      ><strong>Created:</strong> {{ task.createdAt }}</small
                    >
                    <small
                      ><strong>Modified:</strong> {{ task.modifiedAt }}</small
                    >
                  </v-col>
                </v-card>
              </v-list-item>
            </v-list>

            <!-- No Tasks Message -->
            <div
              v-if="filteredTasks.length === 0"
              class="text-center text-grey--text"
            >
              No tasks available. Start by adding a new task above!
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Delete Confirmation Dialog -->
      <v-dialog v-model="deleteDialog" max-width="400">
        <v-card>
          <v-card-title class="text-h5">Confirm Delete</v-card-title>
          <v-card-text>Are you sure you want to delete this task?</v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="cancelDelete"
              >Cancel</v-btn
            >
            <v-btn color="red darken-1" text @click="deleteTask">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      currentDateTime: "",
      newTask: "",
      taskFilter: "All",
      tasks: [],
      deleteDialog: false,
      taskToDelete: null, // Track which task to delete
    };
  },
  created() {
    this.updateTime();
    setInterval(this.updateTime, 1000);
  },
  methods: {
    updateTime() {
      const now = new Date();
      this.currentDateTime = now.toLocaleString();
    },
    addTask() {
      const trimmedTask = this.newTask.trim();
      const now = new Date().toLocaleString();
      if (trimmedTask) {
        this.tasks.unshift({
          text: trimmedTask,
          isEditing: false,
          editText: trimmedTask,
          isDone: false,
          isImportant: false,
          createdAt: now, // Creation date
          modifiedAt: now, // Modification date
        });
        this.newTask = "";
      }
    },
    toggleDone(index) {
      this.tasks[index].isDone = !this.tasks[index].isDone; // Toggle task completion
      this.updateModifiedAt(index);
    },
    toggleImportant(index) {
      this.tasks[index].isImportant = !this.tasks[index].isImportant;
      this.updateModifiedAt(index);
    },
    confirmDeleteTask(index) {
      this.taskToDelete = index;
      this.deleteDialog = true; // Open the delete confirmation dialog
    },
    cancelDelete() {
      this.deleteDialog = false; // Close the dialog without deleting
    },
    deleteTask() {
      if (this.taskToDelete !== null) {
        this.tasks.splice(this.taskToDelete, 1); // Delete the selected task
        this.taskToDelete = null; // Reset taskToDelete
      }
      this.deleteDialog = false; // Close the dialog
    },
    editTask(index) {
      this.tasks[index].isEditing = true; // Enable editing mode
    },
    saveTask(index) {
      const trimmedText = this.tasks[index].editText.trim();
      if (trimmedText) {
        this.tasks[index].text = trimmedText; // Save edited text
        this.tasks[index].isEditing = false; // Disable editing mode
        this.updateModifiedAt(index);
      }
    },
    updateModifiedAt(index) {
      const now = new Date().toLocaleString();
      this.tasks[index].modifiedAt = now; // Update modified date
    },
  },
  computed: {
    filteredTasks() {
      if (this.taskFilter === "Important") {
        return this.tasks.filter((task) => task.isImportant);
      } else if (this.taskFilter === "Not Important") {
        return this.tasks.filter((task) => !task.isImportant);
      }
      return this.tasks;
    },
  },
};
</script>

<style>
@media (max-width: 400px) and (min-width: 200px) {
  .addtask1 {
    display: block;
  }
  .addinput {
    width: 100% !important;
  }
  .addbtn {
    width: 100%;
  }
}

body {
  font-family: "Roboto", sans-serif;
  background-color: #f0f8ff;
}

.task-item {
  margin-bottom: 15px;
}

.action-btn {
  margin-left: 10px; /* Space between buttons */
}

/* Add hover effect to buttons */
.hover-highlight:hover {
  background-color: #e0e0e0;
}

/* Style for completed tasks */
.done {
  text-decoration: line-through;
  color: gray;
}

/* Small text for task creation and modification date */
.task-dates {
  font-size: 12px;
  color: #808080;
  margin-top: 4px;
}

.task-dates small {
  display: block;
}

/* Make responsive design work well on smaller screens */
@media (max-width: 600px) {
  .text-right {
    text-align: left !important;
    margin-top: 10px;
  }
}
</style>
