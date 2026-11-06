import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  SafeAreaView,
  ScrollView
} from "react-native";

import { Picker } from "@react-native-picker/picker";

export default function App() {

  const [screen, setScreen] = useState("Home");

  const [dishName, setDishName] = useState("");
  const [description, setDescription] = useState("");
  const [course, setCourse] = useState("");
  const [price, setPrice] = useState("");

  const [menuItems, setMenuItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterCourse, setFilterCourse] = useState("");

  
  const [editingId, setEditingId] = useState(null);

  
  const saveMenuItem = () => {

    if (!dishName.trim()) {
      Alert.alert("Required", "Enter dish name.");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Required", "Enter description.");
      return;
    }

    if (!course) {
      Alert.alert("Required", "Select a course.");
      return;
    }

    const numericPrice = Number(price);

    if (
      !price.trim() ||
      !Number.isFinite(numericPrice) ||
      numericPrice <= 0
    ) {
      Alert.alert("Invalid Price", "Enter a valid price.");
      return;
    }

    const menuData = {
      dishName: dishName.trim(),
      description: description.trim(),
      course: course,
      price: numericPrice
    };

    if (editingId !== null) {

      
      setMenuItems(items =>
        items.map(item =>
          item.id === editingId
            ? { ...item, ...menuData }
            : item
        )
      );

      Alert.alert("Success", "Menu item updated!");

    } else {

    
      const newItem = {
        id: Date.now().toString(),
        ...menuData
      };

      setMenuItems(items => [...items, newItem]);

      Alert.alert("Success", "Menu item added!");
    }

    clearForm();
    setScreen("Home");
  };

  
  const clearForm = () => {
    setDishName("");
    setDescription("");
    setCourse("");
    setPrice("");
    setEditingId(null);
  };

  
  const editMenuItem = (item) => {

    setDishName(item.dishName);
    setDescription(item.description);
    setCourse(item.course);
    setPrice(item.price.toString());

    setEditingId(item.id);

    setScreen("Form");
  };

  
  const deleteMenuItem = (MenuItemId) => {
   setMenuItems((currentitems)=>
   currentitems.filter(( MenuItem) => MenuItem.id  !== MenuItemId )

   );
   const ConfirmDelete = (MenuItem)=>{
    Alert.alert(
      'Delete menu item',
      'Are you sure you want to delete ${MenuItem.name}?',
      [
        {
          text:'Cancel',
          style:'cancel',
        },
        {
          text:'Delete',
          style:'destructive',
          onPress:() => deleteMenuItem(item.id),
        },
      ]
    )
   }
    Alert.alert(
      "Delete Menu Item",
      "Are you sure you want to delete this dish?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setMenuItems(currentitems =>
              currentitems.filter(item => item.id !== id)
            );
          }
        }
      ]
    );
  };

  
  const filteredItems = menuItems.filter(item => {

    const matchesSearch = item.dishName
      .toLowerCase()
      .includes(searchText.toLowerCase());

    const matchesCourse =
      filterCourse === "" ||
      item.course === filterCourse;

    return matchesSearch && matchesCourse;
  });

  
  const totalItems = menuItems.length;

  const averagePrice = totalItems === 0
    ? 0
    : menuItems.reduce(
        (total, item) => total + item.price, 0
      ) / totalItems;

  const starterCount = menuItems.filter(
    item => item.course === "Starter"
  ).length;

  const mainCount = menuItems.filter(
    item => item.course === "Main Course"
  ).length;

  const dessertCount = menuItems.filter(
    item => item.course === "Dessert"
  ).length;



  if (screen === "Form") {

    return (
      <SafeAreaView style={styles.container}>

        <ScrollView contentContainerStyle={styles.list}>

          <Text style={styles.title}>
            {editingId ? "Edit Menu Item" : "Add Menu Item"}
          </Text>

          <View style={styles.form}>

            <Text style={styles.label}>Dish Name</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter dish name"
              value={dishName}
              onChangeText={setDishName}
            />

            <Text style={styles.label}>Description</Text>

            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              multiline
            />

            <Text style={styles.label}>Select Course</Text>

            <View style={styles.pickerContainer}>

              <Picker
                selectedValue={course}
                onValueChange={setCourse}
              >
                <Picker.Item
                  label="Select a course"
                  value=""
                />

                <Picker.Item
                  label="Starter"
                  value="Starter"
                />

                <Picker.Item
                  label="Main Course"
                  value="Main Course"
                />

                <Picker.Item
                  label="Dessert"
                  value="Dessert"
                />

              </Picker>

            </View>

            <Text style={styles.label}>Price (R)</Text>

            <TextInput
              style={styles.input}
              placeholder="Enter price"
              value={price}
              onChangeText={setPrice}
              keyboardType="decimal-pad"
            />

            <TouchableOpacity
              style={styles.button}
              onPress={saveMenuItem}
            >
              <Text style={styles.buttonText}>
                {editingId ? "Update Menu Item" : "Save Menu Item"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                clearForm();
                setScreen("Home");
              }}
            >
              <Text style={styles.backText}>
                Back to Home
              </Text>
            </TouchableOpacity>

          </View>

        </ScrollView>

      </SafeAreaView>
    );
  }



  return (

    <SafeAreaView style={styles.container}>

      <FlatList

        data={filteredItems}

        keyExtractor={item => item.id}

        contentContainerStyle={styles.list}

        ListHeaderComponent={

          <>

            <Text style={styles.title}>
              Chef Menu Manager
            </Text>

            {/* STATISTICS */}

            <Text style={styles.heading}>
              Menu Statistics
            </Text>

            <View style={styles.statsContainer}>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {totalItems}
                </Text>
                <Text>Total Items</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  R{averagePrice.toFixed(2)}
                </Text>
                <Text>Average Price</Text>
              </View>

            </View>

            <View style={styles.statsContainer}>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {starterCount}
                </Text>
                <Text>Starters</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {mainCount}
                </Text>
                <Text>Main Courses</Text>
              </View>

              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {dessertCount}
                </Text>
                <Text>Desserts</Text>
              </View>

            </View>


            {/* ADD BUTTON */}

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                clearForm();
                setScreen("Form");
              }}
            >
              <Text style={styles.buttonText}>
                + Add Menu Item
              </Text>
            </TouchableOpacity>


            {/* SEARCH */}

            <Text style={styles.heading}>
              Search Menu Items
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Search by dish name..."
              value={searchText}
              onChangeText={setSearchText}
            />


            {/* FILTER */}

            <Text style={styles.label}>
              Filter by Course
            </Text>

            <View style={styles.pickerContainer}>

              <Picker
                selectedValue={filterCourse}
                onValueChange={setFilterCourse}
              >
                <Picker.Item
                  label="All Courses"
                  value=""
                />

                <Picker.Item
                  label="Starter"
                  value="Starter"
                />

                <Picker.Item
                  label="Main Course"
                  value="Main Course"
                />

                <Picker.Item
                  label="Dessert"
                  value="Dessert"
                />

              </Picker>

            </View>


            {/* CLEAR SEARCH */}

            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchText("");
                setFilterCourse("");
              }}
            >
              <Text style={styles.clearText}>
                Clear Search and Filter
              </Text>
            </TouchableOpacity>


            <Text style={styles.heading}>
              Prepared Menu
            </Text>

          </>

        }

        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            {menuItems.length === 0
              ? "No menu items have been added yet."
              : "No matching menu items found."}
          </Text>
        }

        renderItem={({ item }) => (

          <View style={styles.menuCard}>

            <Text style={styles.dishName}>
              {item.dishName}
            </Text>

            <Text style={styles.course}>
              {item.course}
            </Text>

            <Text style={styles.description}>
              {item.description}
            </Text>

            <Text style={styles.price}>
              R{item.price.toFixed(2)}
            </Text>


          

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => editMenuItem(item)}
            >
              <Text style={styles.buttonText}>
                Edit Menu Item
              </Text>
            </TouchableOpacity>


          

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => deleteMenuItem(item.id)}
            >
              <Text style={styles.buttonText}>
                Delete Menu Item
              </Text>
            </TouchableOpacity>

          </View>

        )}

      />

    </SafeAreaView>

  );
}


// STYLES

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#F5F5F5"
  },

  list: {
    padding: 20,
    paddingBottom: 40
  },

  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#2E7D32",
    textAlign: "center",
    marginBottom: 20
  },

  heading: {
    fontSize: 21,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 12,
    color: "#333"
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12
  },

  statCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 4,
    alignItems: "center",
    elevation: 2
  },

  statNumber: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#2E7D32",
    marginBottom: 5
  },

  form: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12
  },

  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 7
  },

  input: {
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "#CCC",
    padding: 12,
    borderRadius: 8,
    fontSize: 16
  },

  textArea: {
    height: 90,
    textAlignVertical: "top"
  },

  pickerContainer: {
    borderWidth: 1,
    borderColor: "#CCC",
    borderRadius: 8,
    backgroundColor: "white",
    overflow: "hidden"
  },

  button: {
    backgroundColor: "#2E7D32",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center"
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 15
  },

  backButton: {
    padding: 15,
    marginTop: 10
  },

  backText: {
    color: "#2E7D32",
    textAlign: "center",
    fontWeight: "bold"
  },

  menuCard: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 3
  },

  dishName: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#333"
  },

  course: {
    color: "#2E7D32",
    fontWeight: "bold",
    marginTop: 5
  },

  description: {
    color: "#555",
    marginTop: 8
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10
  },

  editButton: {
    backgroundColor: "#1976D2",
    padding: 12,
    borderRadius: 8,
    marginTop: 12
  },

  deleteButton: {
    backgroundColor: "#C62828",
    padding: 12,
    borderRadius: 8,
    marginTop: 8
  },

  clearButton: {
    padding: 12,
    alignItems: "center",
    marginTop: 5
  },

  clearText: {
    color: "#C62828",
    fontWeight: "bold"
  },

  emptyMessage: {
    textAlign: "center",
    color: "#777",
    padding: 20
  }

});
