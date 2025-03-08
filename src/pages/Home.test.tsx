import { render, screen, fireEvent, act, within } from "@testing-library/react";
import { Home } from "./Home"; // Replace with your actual path
import "@testing-library/jest-dom";
import React from "react";
import { iExcerciseData } from "../models/ExcerciseInterface";
// import { letterSpacing } from "html2canvas/dist/types/css/property-descriptors/letter-spacing";

// Mocking this, cuz it was giving an error regarding jspdf which I am using to generate pdf and it's using Canvas which is not supported by jest
jest.mock("jspdf", () => ({
  jsPDF: jest.fn().mockImplementation(() => ({
    text: jest.fn(),
    save: jest.fn(),
    addImage: jest.fn(),
    output: jest.fn(),
    addPage: jest.fn(),
  })),
}));

// const deleteExcerciseMock = (id: string) => {
//   for (let i = 0; i < mockExcercises.length; i++) {
//     if (i.toString() === id) {
//       mockExcercises = mockExcercises.splice(i, 1);
//     //   setMockExcercises(mockExcercises);
//       break;
//     }
//   } 
// };

// Mock data for search functionality
let mockExcercises: iExcerciseData[] = [
    {
      name: "Push ups",
      imgSrc: "../src/assets/Excercises/PushUps.png",
      description: {
        sets: 1,
        setsDescription: "1 set",
        repititions: 10,
        repititionsDescription: "10 repetitions",
        Cues: {
          Points: [
            "Often easiest to start with push-ups on knees.",
            "Start in prone.",
            "Hands by chest.",
            "Knees bent.",
            "Knees together.",
            "Push-up - hold 2 seconds (count 1-2).",
            "Control down.",
          ],
        },
      },
      type: "Fundamental",
      tags: ["Core"],
    },
    {
      name: "Planks",
      imgSrc: "../src/assets/Excercises/Planks.png",
      description: {
        sets: 1,
        setsDescription: "1 set",
        repititions: 10,
        repititionsDescription: "10 repetitions",
        Cues: {
          Points: [
            "Often easiest to start in quadruped, then move to front plank or high plank.",
          ],
        },
      },
      type: "Fundamental",
      tags: ["Core"],
    },
  ];
// const [mockExcercises, setMockExcercises] = useState<iExcerciseData[]>(data);

// Mock data and setup
jest.mock("../databaseConnections/DatabaseController", () => ({
  getInstance: () => ({
    fetchNodeData: jest.fn(() => Promise.resolve(mockExcercises)),
  }),
}));

jest.mock("../databaseConnections/DatabaseController", () => ({
  getInstance: () => ({
    fetchNodeData: jest.fn(() => Promise.resolve(mockExcercises)),
    deleteNodeData: jest.fn((id) => {
      mockExcercises = mockExcercises.filter(
        (excercise) => excercise.name !== id
      );
      return Promise.resolve(mockExcercises);
    }),
  }),
}));

// Search functionality test

describe("Home Component - Search", () => {
  it("filters excercises based on search input", async () => {
    render(<Home />);
    const searchInput = await screen.findByPlaceholderText("Search");

    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "Push ups" } });
    });

    // Wait for data to load
    await screen.findByText("Push ups");
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
    expect(screen.getByText("Push ups")).toBeInTheDocument();
    expect(screen.queryByText("Planks")).not.toBeInTheDocument();
  });

  it("displays all excercises when search input is empty", async () => {
    render(<Home />);
    const searchInput = await screen.findByPlaceholderText("Search");
    // const searchInput = screen.getByRole("textbox", { name: /search/i });
    await act(async () => {
      fireEvent.change(searchInput, { target: { value: "" } });
    });

    // Wait for data to load
    await screen.findByText("Planks");

    expect(screen.getByText("Push ups")).toBeInTheDocument();
    expect(screen.getByText("Planks")).toBeInTheDocument();
  });
});

// test for adding excercise to planner

describe("Home Component - Planner", () => {
  it("adds an excercise to the planner when the add button is clicked", async () => {
    render(<Home />);

    const plankText = await screen.findByText("Planks"); // Adjust selector if needed
    const plankCard = plankText.closest(".flex-block");
    // Within the "Plank" card, find the "Add" button.
    if (plankCard) {
      const addButton = within(plankCard as HTMLElement).getByRole("button", {
        name: /Add/i,
      });

      // Click the "Add" button.
      await act(async () => {
        fireEvent.click(addButton);
      });

      // Add your assertions here to check if the item was added to the planner.
      // For example:
      const plannerList = await screen.getByTestId("homePlannerList");
      expect(within(plannerList).getByText("Planks")).toBeInTheDocument();
    } else {
      throw new Error("Plank card not found.");
    }
  });
});

// Testing the modals

describe("Home Component - Modals", () => {
  it("opens the excercise detail modal", async () => {
    render(<Home />);
    const plankText = await screen.findByText("Planks"); // Adjust selector if needed
    const plankCard = plankText.closest(".flex-block");
    // Within the "Plank" card, find the "Add" button.
    if (plankCard) {
      const clickArea1 = within(plankCard as HTMLElement).getByTestId(
        "excerciseName"
      );
      const clickArea2 = within(plankCard as HTMLElement).getByTestId(
        "excerciseImg"
      );
      const clickArea3 = within(plankCard as HTMLElement).getByTestId(
        "excerciseType"
      );

      // Click the "Add" button.
      await act(async () => {
        fireEvent.click(clickArea1);
      });

      // Add your assertions here to check if the item was added to the planner.
      // For example:
      const excerciseDetailModal = await screen.getByTestId(
        "ExcerciseDetailModal"
      );
      expect(
        within(excerciseDetailModal).getByText("Planks")
      ).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(clickArea2);
      });

      // Add your assertions here to check if the item was added to the planner.
      // For example:
      const excerciseDetailModalClick2 = await screen.getByTestId(
        "ExcerciseDetailModal"
      );
      expect(
        within(excerciseDetailModalClick2).getByText("Planks")
      ).toBeInTheDocument();

      await act(async () => {
        fireEvent.click(clickArea3);
      });

      // Add your assertions here to check if the item was added to the planner.
      // For example:
      const excerciseDetailModalClick3 = await screen.getByTestId(
        "ExcerciseDetailModal"
      );
      expect(
        within(excerciseDetailModalClick3).getByText("Planks")
      ).toBeInTheDocument();

      const closeButton =
        within(excerciseDetailModal).getByTestId("modalCloseBtn"); // Assuming a close button in your modal
      fireEvent.click(closeButton);

      expect(
        screen.queryByTestId("ExcerciseDetailModal")
      ).not.toBeInTheDocument();
    } else {
      throw new Error("Plank card not found.");
    }
  });

  it("opens the add excercise modal", async () => {
    render(<Home />);
    const addButton = screen.getByTestId("createExcerciseBtn");
    await act(async () => {
      fireEvent.click(addButton);
    });
    const addExcerciseModalClick = screen.queryByTestId("AddExcerciseModal");

    if (addExcerciseModalClick) {
      // checking items to be present in the Modal
      expect(
        within(addExcerciseModalClick).getByRole("heading", {
          name: /Add Excercise/i,
        })
      ).toBeInTheDocument();
      expect(
        within(addExcerciseModalClick).getByRole("button", {
          name: /Add Excercise/i,
        })
      ).toBeInTheDocument();

      expect(
        within(addExcerciseModalClick).getByTestId("setNumberInput")
      ).toBeInTheDocument();
      expect(
        within(addExcerciseModalClick).getByTestId("setDescriptionInput")
      ).toBeInTheDocument();
      expect(
        within(addExcerciseModalClick).getByTestId("repititionNumberInput")
      ).toBeInTheDocument();
      expect(
        within(addExcerciseModalClick).getByTestId("repititionDescriptionInput")
      ).toBeInTheDocument();
      expect(
        within(addExcerciseModalClick).getByTestId("excerciseNameInput")
      ).toBeInTheDocument();
      expect(
        within(addExcerciseModalClick).getByTestId("excerciseDescriptionInput")
      ).toBeInTheDocument();

      // checking the closing logic
      const closeButton = within(addExcerciseModalClick).getByTestId(
        "modalCloseBtn"
      ); // Assuming a close button in your modal
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("AddExcerciseModal")).not.toBeInTheDocument();
    } else {
      throw new Error("Add Excercise Modal not found.");
    }
  });

  it("check functionalities of Edit excercise modal", async () => {
    render(<Home />);
    const plankText = await screen.findByText("Planks"); // Adjust selector if needed
    const plankCard = plankText.closest(".flex-block");
    if (plankCard) {
      const editButton = within(plankCard as HTMLElement).getByRole("button", {
        name: /Edit/i,
      });
      await act(async () => {
        fireEvent.click(editButton);
      });
      const editExcerciseModal = screen.queryByTestId("EditExcerciseModal");
      if (editExcerciseModal) {
        expect(
          within(editExcerciseModal).getByRole("heading", {
            name: /Edit Excercise/i,
          })
        ).toBeInTheDocument();
        expect(
          within(editExcerciseModal).getByRole("button", {
            name: /Edit Excercise/i,
          })
        ).toBeInTheDocument();

        expect(
          within(editExcerciseModal).getByTestId("setNumberInput")
        ).toHaveValue(1);
        expect(
          within(editExcerciseModal).getByTestId("setDescriptionInput")
        ).toHaveValue("1 set");
        expect(
          within(editExcerciseModal).getByTestId("repititionNumberInput")
        ).toHaveValue(10);
        expect(
          within(editExcerciseModal).getByTestId("repititionDescriptionInput")
        ).toHaveValue("10 repetitions");
        expect(
          within(editExcerciseModal).getByTestId("excerciseNameInput")
        ).toHaveValue("Planks");
        expect(
          within(editExcerciseModal).getByTestId("excerciseDescriptionInput")
        ).toHaveValue(
          "Often easiest to start in quadruped, then move to front plank or high plank."
        );

        // Checking close modal logic.
        const closeButton =
          within(editExcerciseModal).getByTestId("modalCloseBtn");
        fireEvent.click(closeButton);
        expect(
          screen.queryByTestId("EditExcerciseModal")
        ).not.toBeInTheDocument();
      } else {
        throw new Error("Edit Excercise Modal not found.");
      }
    }
  });

  it("checking the delete functionality", async () => {
    render(<Home />);
    const plankText = await screen.findByText("Planks"); // Adjust selector if needed
    const plankCard = plankText.closest(".flex-block");
    if (plankCard) {
      const deleteButton = within(plankCard as HTMLElement).getByRole(
        "button",
        {
          name: /Delete/i,
        }
      );
      await act(async () => {
        fireEvent.click(deleteButton);
      });
    //   deleteExcerciseMock("2");
      // not able to check the delete functionality unfortunately
    //   expect(mockExcercises.length).toBe(1);
      expect(plankCard).not.toBeInTheDocument();
    }
  });
});
