


type ComponentFactory<T> = () => T;


export async function lazyLoad<T>(
  factory: ComponentFactory<T>,
  componentName: string
): Promise<T> {
  try {
    
    await new Promise((resolve) => setTimeout(resolve, 10));

    
    const instance = factory();

    return instance;
  } catch (error) {
    console.error(`Failed to lazy load ${componentName}:`, error);
    throw error;
  }
}
