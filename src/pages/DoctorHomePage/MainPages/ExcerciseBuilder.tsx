import React, { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { ExcerciseTile } from "./ExcerciseBuilder/ExcerciseTile";
import {
  ExcerciseType,
  iExcerciseDataDto,
  iExcerciseTile,
} from "../../../models/ExcerciseInterface";
import { PlannerList } from "./ExcerciseBuilder/PlannerList";
import Modal from "../../../components/Modal";
import { PDFPreview } from "../../../components/PDFPreview";
import { Box, Button, TextField, Spinner, Text, Flex } from "@radix-ui/themes";
import { getAllExcercises } from "../../../controllers/ExcerciseController";
import ThemeColorPallate from "../../../assets/ThemeColorPallate";
import { useCurrentMainScreenContext } from "../DoctorHomePage";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { DefaultToastTiming, useToast } from "../../../stores/ToastContext";
import { ToastColors } from "../../../components/Toast";
import { IoMdAdd } from "react-icons/io";
import { styled } from "@stitches/react";
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const BuilderContainer = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  height: '94vh',
  position: 'relative',
  backgroundColor: ThemeColorPallate.background,
});

const MainContent = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  width: '80%',
  height: '100%',
  padding: '20px 20px 10px 20px',
  position: 'relative',

  '@media (max-width: 768px)': {
    padding: '12px 12px 10px 12px',
  }
});

const ExerciseGrid = styled(Box, {
  display: 'grid',
  gap: '16px',
  width: '100%',
  height: '100%',
  maxHeight: 'calc(100vh - 150px)',
  overflow: 'auto',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  padding: '8px',

  '@media (max-width: 768px)': {
    gridTemplateColumns: '1fr',
    gap: '12px',
    maxHeight: 'calc(100vh - 130px)',
  }
});

const SearchContainer = styled('div', {
  position: 'sticky',
  bottom: 0,
  left: 0,
  width: '100%',
  padding: '16px 16px 8px 16px',
  backgroundColor: ThemeColorPallate.background,
  boxShadow: '0px -4px 10px rgba(0, 0, 0, 0.1)',
  zIndex: 10,

  '@media (max-width: 768px)': {
    padding: '12px 12px 0px 12px',
  }
});

const AddButton = styled(Button, {
  position: 'relative',
  bottom: '10px',
  left: '20px',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.2s ease',
  zIndex: 20,

  '&:hover': {
    transform: 'scale(1.05)',
  },

  '@media (max-width: 768px)': {
    bottom: '10px',
    right: '16px',
    width: '48px',
    height: '48px',
  }
});

const CounterButton = styled('button', {
  position: 'fixed',
  bottom: '80px',
  left: '22rem',
  borderRadius: '50%',
  width: '56px',
  height: '56px',
  backgroundColor: ThemeColorPallate.primary,
  color: 'white',
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '20px',
  fontWeight: 'bold',
  border: 'none',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  transition: 'transform 0.2s ease',
  zIndex: 20,

  '&:hover': {
    transform: 'scale(1.05)',
  },

  '@media (max-width: 992px)': {
    display: 'flex',
    bottom: '90px',
    right: '16px',
    width: '48px',
    height: '48px',
  }
});

const PlannerSidebar = styled(Box, {
  flex: '0 0 350px',
  marginLeft: '12px',
  boxShadow: '-4px 0px 15px rgba(0, 0, 0, 0.15)',
  backgroundColor: ThemeColorPallate.background,
  
  '@media (max-width: 992px)': {
    display: 'none',
  }
});

const LIMIT = 20;

interface ExerciseBuilderProps {
    isExcerciseBuilderRefresh: boolean;
    debouncedValue: string;
}

export const ExerciseBuilder: React.FC<ExerciseBuilderProps> = ({ isExcerciseBuilderRefresh, debouncedValue }) => {
    const [displayedExercises, setDisplayedExercises] = useState<iExcerciseDataDto[]>([]);
    const {
        isExcerciseBuilderLoading,
        setIsExcerciseBuilderLoading,
        excerciseBuilderPlannerList,
        setExcerciseBuilderPlannerList,
    } = useCurrentMainScreenContext();
    const { showToast } = useToast();
    const [isPlannerListModalOpen, setIsPlannerListModalOpen] =
        useState<boolean>(false);
    const [isPDFPreviewModalOpen, setIsPDFPreviewModalOpen] =
        useState<boolean>(false);

    const navigate = useNavigate();
    const {pid} = useParams();

    const [offset, setOffset] = useState<number>(0);
    const offsetRef = useRef<number>(0);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [initialLoadComplete, setInitialLoadComplete] = useState<boolean>(false);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    
    const [searchTerm, setSearchTerm] = useState('');

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        offsetRef.current = offset;
    }, [offset]);

    const fetchExerciseData = useCallback(async (currentOffset: number, limit: number, term: string, isInitialLoad = false) => {
        if (isInitialLoad) {
            setIsExcerciseBuilderLoading(true);
        }
        console.log(`FETCHING EXERCISES: currentOffset=${currentOffset}, limit=${limit}, term='${term}', isInitialLoad=${isInitialLoad}`);

        getAllExcercises({
            data: { 
                limit: limit,
                offset: currentOffset,
                searchTerm: term,
            },
            afterAPISuccess: (response) => {
                console.log('API Success Response:', response);
                const newExercises = response.data?.excercises || [];
                const pagination = response.data?.pagination;
                const receivedCount = newExercises.length;
                console.log(`Received ${receivedCount} exercises. Limit was ${limit}. Backend reports total: ${pagination?.total}`); 
                
                setDisplayedExercises(prev => {
                    const updatedExercises = isInitialLoad ? newExercises : [...prev, ...newExercises];
                    console.log(`State Update: Previous=${prev.length}, New=${newExercises.length}, Total=${updatedExercises.length}`);
                    return updatedExercises;
                });
                
                // Update offset after successful data fetch
                const newOffset = currentOffset + receivedCount; 
                setOffset(newOffset);
                
                // Determine if more data is available
                const moreAvailable = pagination?.total ? (currentOffset + receivedCount) < pagination.total : receivedCount >= limit;
                setHasMore(moreAvailable);
                console.log(`Setting hasMore to: ${moreAvailable} (total: ${pagination?.total}, current: ${currentOffset + receivedCount})`);
                
                if (isInitialLoad) {
                    setInitialLoadComplete(true);
                    setIsExcerciseBuilderLoading(false);
                }
                setIsLoadingMore(false);
            },
            afterAPIFail: (response) => {
                console.error("API Failure Response:", response);
                showToast("Failed to load exercises", DefaultToastTiming, ToastColors.RED);
                setHasMore(false);
                if (isInitialLoad) {
                    setInitialLoadComplete(true);
                    setIsExcerciseBuilderLoading(false);
                }
                setIsLoadingMore(false);
            },
        });
    }, [setIsExcerciseBuilderLoading, showToast]);

    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container || isLoadingMore || !hasMore || !initialLoadComplete) {
            return;
        }

        const { scrollTop, scrollHeight, clientHeight } = container;
        const scrollThreshold = 100; // Reduced threshold for earlier trigger
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - scrollThreshold;

        console.log(`Scroll Check: ${scrollTop + clientHeight} >= ${scrollHeight - scrollThreshold}, Near Bottom: ${isNearBottom}`);

        if (isNearBottom) {
            console.log('Triggering fetch for more data');
            setIsLoadingMore(true);
            const currentOffset = offsetRef.current;
            console.log(`Fetching more with offset: ${currentOffset}`);
            fetchExerciseData(currentOffset, LIMIT, debouncedValue, false);
        }
    }, [isLoadingMore, hasMore, initialLoadComplete, debouncedValue, fetchExerciseData, setIsLoadingMore]);

    // Add scroll event listener
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
            return () => container.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    // Update offsetRef whenever offset changes
    useEffect(() => {
        console.log(`Updating offsetRef to: ${offset}`);
        offsetRef.current = offset;
    }, [offset]);

    // Reset and initial load effect
    useEffect(() => {
        console.log('Resetting and performing initial load');
        setDisplayedExercises([]);
        setOffset(0);
        setHasMore(true);
        setInitialLoadComplete(false);
        setIsLoadingMore(false);
        
        const initialOffset = 0;
        fetchExerciseData(initialOffset, LIMIT, debouncedValue, true);
        
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }, [debouncedValue, fetchExerciseData, setDisplayedExercises, setOffset, setHasMore, setInitialLoadComplete, setIsLoadingMore]);

    // Manual refresh effect
    useEffect(() => {
        if (isExcerciseBuilderRefresh) {
            console.log('Manual refresh triggered');
            setDisplayedExercises([]);
            setOffset(0);
            setHasMore(true);
            setInitialLoadComplete(false);
            setIsLoadingMore(false);
            
            const initialOffset = 0;
            fetchExerciseData(initialOffset, LIMIT, debouncedValue, true);
            
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollTop = 0;
            }
        }
    }, [isExcerciseBuilderRefresh, debouncedValue, fetchExerciseData, setDisplayedExercises, setOffset, setHasMore, setInitialLoadComplete, setIsLoadingMore]);

    const onAdd = (clickedExcercise: iExcerciseDataDto) => {
        if (excerciseBuilderPlannerList.find((item) => item.e_id === clickedExcercise.e_id)) {
            showToast("Exercise already added", DefaultToastTiming, ToastColors.YELLOW);
            return;
        }
        setExcerciseBuilderPlannerList((prev) => [...prev, clickedExcercise]);
    };

    const onEditExcerciseClick = (excercise: iExcerciseDataDto) => {
        navigate(`editExcercise`, { state: { excercise } });
    };

    const onExcerciseTileForDetailClicked = (excercise: iExcerciseDataDto) => {
        navigate(`excerciseDetail`, { state: { excercise } }); 
    };
    
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const manualRefresh = () => {
        console.log("Manual refresh button clicked");
        setDisplayedExercises([]);
        setOffset(0);
        setHasMore(true);
        setInitialLoadComplete(false);
        const initialOffset = 0; 
        fetchExerciseData(initialOffset, LIMIT, debouncedValue, true);
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
    }

    // --- Initial Load & Search Term Change --- //
    useEffect(() => {
        console.log(`Search Term Changed / Initial Load: '${debouncedValue}'`);
        // Reset and fetch when search term changes (debounced)
        setDisplayedExercises([]);
        setOffset(0);
        setHasMore(true); // *** Reset hasMore to true for the new search ***
        setInitialLoadComplete(false); 
        setIsLoadingMore(false); // Ensure loadingMore is false initially
        // Use a temporary variable for offset to avoid race condition with state update
        const initialOffset = 0; 
        fetchExerciseData(initialOffset, LIMIT, debouncedValue, true);
        // Reset scroll position
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = 0;
        }
        // **Important:** The dependency array was updated in the previous step, keep it as [debouncedValue, fetchExerciseData]
    }, [debouncedValue, fetchExerciseData]); 

    return (
        <>
            <Outlet />
            <BuilderContainer>
                <MainContent>
                    <ExerciseGrid ref={scrollContainerRef}>
                        {isExcerciseBuilderLoading && !initialLoadComplete && (
                            <Flex justify="center" align="center" py="4" style={{ gridColumn: '1 / -1', minHeight: '200px' }}>
                                <Spinner size="3" />
                                <Text ml="2" color="gray">Loading Exercises...</Text>
                            </Flex>
                        )}

                        {!isExcerciseBuilderLoading && (
                            <Suspense fallback={<div>Loading...</div>}>
                                {displayedExercises.map((excercise) => {
                                    // *** Bundle props into a single 'data' object ***
                                    const tileData: iExcerciseTile = {
                                        excercise: excercise,
                                        excerciseKey: excercise.e_id, // Ensure key is included if needed by interface
                                        viewType: ExcerciseType.FULL_VIEW,
                                        onAdd: onAdd,
                                        onEdit: () => onEditExcerciseClick(excercise),
                                        onClick: () => onExcerciseTileForDetailClicked(excercise),
                                        refreshExcercise: manualRefresh,
                                        // Include any other required fields from iExcerciseTile if necessary
                                        // onExcerciseTileClick is likely handled by onClick now, check interface
                                    };
                                    return (
                                        <ExcerciseTile
                                            key={excercise.e_id} 
                                            data={tileData} // Pass the single data object
                                        />
                                    )
                                })}
                            </Suspense>
                        )}
                        
                        {isLoadingMore && (
                            <Flex justify="center" align="center" py="4" style={{ gridColumn: '1 / -1' }}>
                                <Spinner size="3" />
                                <Text ml="2" color="gray">Loading more...</Text>
                            </Flex>
                        )}
                        
                        {initialLoadComplete && !isLoadingMore && displayedExercises.length === 0 && (
                            debouncedValue === '' ? (
                                <Flex justify="center" align="center" py="4" style={{ gridColumn: '1 / -1' }}>
                                    <Text color="gray">No exercises available yet. Add one!</Text>
                                </Flex>
                            ) : (
                                <Flex justify="center" align="center" py="4" style={{ gridColumn: '1 / -1' }}>
                                    <Text color="gray">No exercises found matching your search.</Text>
                                </Flex>
                            )
                        )}
                        
                        {initialLoadComplete && !isLoadingMore && !hasMore && displayedExercises.length > 0 && (
                            <Flex justify="center" align="center" py="4" style={{ gridColumn: '1 / -1' }}>
                                <Text color="gray">No more exercises found.</Text>
                            </Flex>
                        )}

                    </ExerciseGrid>
                    
                    <AddButton 
                        variant="solid" 
                        onClick={() => navigate(`/doctorhome/main/patientDetails/${pid}/buildPlan/addExcercise`)}
                    >
                        <IoMdAdd size={24} style={{ color: 'white' }} />
                    </AddButton>

                    <CounterButton onClick={() => setIsPlannerListModalOpen(true)}>
                        {excerciseBuilderPlannerList.length}
                    </CounterButton>

                    <SearchContainer>
                        <TextField.Root
                            placeholder="Search exercises..."
                            size="3"
                            radius="full"
                            style={{
                                width: '100%',
                                backgroundColor: ThemeColorPallate.background,
                                color: 'white',
                            }}
                            value={searchTerm}
                            onChange={handleSearchChange}
                        >
                            <TextField.Slot>
                                <MagnifyingGlassIcon height="16" width="16" />
                            </TextField.Slot>
                        </TextField.Root>
                    </SearchContainer>
                </MainContent>

                <PlannerSidebar>
                    <PlannerList
                        testId={"homePlannerList"}
                        isPDFPreviewModelRequired={isPDFPreviewModalOpen}
                        setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
                    />
                </PlannerSidebar>

                {isPlannerListModalOpen && (
                    <Modal
                        testId={"PlannerListModal"}
                        title={"Patient Plan"}
                        pIsOpen={isPlannerListModalOpen}
                        setIsModelOpen={setIsPlannerListModalOpen}
                    >
                        <PlannerList
                            testId={"mobilePlannerList"}
                            isPDFPreviewModelRequired={isPDFPreviewModalOpen}
                            setIsPDFPreviewModelRequired={setIsPDFPreviewModalOpen}
                        />
                    </Modal>
                )}

                {isPDFPreviewModalOpen && (
                    <Modal
                        testId={"PDFPreviewModal"}
                        title={"PDF Preview"}
                        pIsOpen={isPDFPreviewModalOpen}
                        setIsModelOpen={setIsPDFPreviewModalOpen}
                    >
                        <PDFPreview plannerList={excerciseBuilderPlannerList} />
                    </Modal>
                )}
            </BuilderContainer>
        </>
    );
};

export default ExerciseBuilder;
