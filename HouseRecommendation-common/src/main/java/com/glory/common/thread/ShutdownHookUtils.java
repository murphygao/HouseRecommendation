package com.glory.common.thread;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.TimeUnit;

/**
 * 线程关闭工具
 *
 * @author Glory
 * @create 2017-05-05 13:45
 **/
public class ShutdownHookUtils {

    private static final Logger logger = LoggerFactory.getLogger(ShutdownHookUtils.class);

    private ShutdownHookUtils() {
    }

    /**
     * 线程池关闭方法
     * @param executor         线程池
     * @param timeoutSeconds   关闭等待时间
     */
    public static void hook(final ExecutorService executor, final int timeoutSeconds) {
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            logger.info("Into shutdown hook!");
            if (executor == null){
                return;
            }

            executor.shutdown();
            try {
                if (!executor.awaitTermination(timeoutSeconds, TimeUnit.SECONDS)) {
                    logger.warn("Executor did not terminate in the specified time.");
                    List<Runnable> droppedTasks = executor.shutdownNow();
                    logger.warn("Executor was abruptly shut down. " + droppedTasks.size() + " tasks will not be executed.");
                }
            } catch (InterruptedException e) {
                logger.error(e.getMessage(), e);
                Thread.currentThread().interrupt();
            }
        }));
    }

    /**
     * 线程关闭方法
     * @param runnable    线程
     */
    public static void hook(Runnable runnable) {
        Runtime.getRuntime().addShutdownHook(new Thread(runnable));
    }
}
