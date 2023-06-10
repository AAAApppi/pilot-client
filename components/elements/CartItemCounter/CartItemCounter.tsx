import { $mode } from "@/context/mode";
import { ICartItemCounterProps } from "@/types/shopping-cart";
import { useStore } from "effector-react";
import styles from '@/styles/cartPopup/index.module.scss'
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { updateCartItemFx } from "@/app/api/shopping-cart";
import { updateCartItemCount } from "@/context/shopping-cart";

const CartItemCounter = ({
    totalCount,
    partId,
    increasePrice,
    decreasePrice,
    initialCount
}: ICartItemCounterProps) => {
    const mode = useStore($mode)
    const darkModeClass = mode === 'dark' ? `${styles.dark_mode}` : ''
    const [spinner, setPinner] = useState(false)
    const [count, setCount] = useState(initialCount)
    const [disableIncrease, setDisableIncrease] = useState(false)
    const [disableDecrease, setDisableDecrease] = useState(false)

    useEffect(() => {
        if (count === 1) {
            setDisableDecrease(true)
        }

        if (count === totalCount) {
            setDisableIncrease(true)
        }
    }, [count, totalCount])

    const increase = async () => {
        try {
            setPinner(true)
            increasePrice()
            setDisableIncrease(false)
            setCount(count + 1)


            const data = await updateCartItemFx({
                url: `/shopping-cart/count/${partId}`,
                payload: { count: count + 1 }
            })
            updateCartItemCount({ partId, count: data.count })
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setPinner(false)
        }
    }

    const decrease = async () => {
        try {
            setPinner(true)
            decreasePrice
            setDisableDecrease
            setCount(count - 1)


            const data = await updateCartItemFx({
                url: `/shopping-cart/count/${partId}`,
                payload: { count: count - 1 }
            })
            updateCartItemCount({ partId, count: data.count })
        } catch (error) {
            toast.error((error as Error).message)
        } finally {
            setPinner(false)
        }
    }


    return (
        <div>
            <button onClick={increase}>-</button>
            <span>
                {spinner ? <span /> : count}
            </span>
            <button onClick={decrease}>+</button>
        </div>
    )

}

export default CartItemCounter