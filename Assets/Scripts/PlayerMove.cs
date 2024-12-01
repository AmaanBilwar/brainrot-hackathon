using UnityEngine;

public class PlayerMove : MonoBehaviour
{
    [Header("Movement Settings")]
    public float moveSpeedXAtPointA = 5f;
    public float moveSpeedXAtPointB = 1f;
    public float moveSpeedYAtPointA = 0.7f;
    public float moveSpeedYAtPointB = 0.1f;

    [Header("Scaling Settings")]
    public Transform shrinkTarget;
    public float scaleAtPointA = 1.5f;
    public float scaleAtPointB = 0.1f;

    [Header("Bobbing Settings")]
    public float baseBobbingSpeed = 5;
    public float bobbingAmountAtPointA = 0.2f;
    public float bobbingAmountAtPointB = 0.05f;

    [Header("Y Follower Settings")]
    public Transform yFollower;
    public float yFollowerScaleAtPointA = 1.5f;
    public float yFollowerScaleAtPointB = 0.1f;
    public float yOffsetAtPointA = 0f;
    public float yOffsetAtPointB = 2f;

    [Header("References")]
    public Transform pointAy;
    public Transform pointBy;
    public Transform pointAx;
    public Transform pointBx;
    public SpriteRenderer spriteRenderer;

    private float minY;
    private float maxY;
    private float minX;
    private float maxX;
    private Vector3 initialShrinkTargetPosition;

    public bool isMoving { get; private set; }  

    void Start()
    {
        minY = pointAy.position.y;
        maxY = pointBy.position.y;
        minX = pointAx.position.x;
        maxX = pointBx.position.x;

        if (shrinkTarget == null)
        {
            shrinkTarget = this.transform;
        }

        initialShrinkTargetPosition = shrinkTarget.localPosition;
    }

    void Update()
    {
        float horizontalInput = Input.GetAxis("Horizontal");
        float verticalInput = Input.GetAxis("Vertical");

        isMoving = horizontalInput != 0 || verticalInput != 0;

        float moveSpeedX = GetValueBasedOnPos(transform.position.y, moveSpeedXAtPointB, moveSpeedXAtPointA);
        float moveSpeedY = GetValueBasedOnPos(transform.position.y, moveSpeedYAtPointB, moveSpeedYAtPointA);

        Vector3 newPosition = transform.position;
        newPosition.x += horizontalInput * moveSpeedX * Time.deltaTime;
        newPosition.y += verticalInput * moveSpeedY * Time.deltaTime;

        newPosition.x = Mathf.Clamp(newPosition.x, minX, maxX);
        newPosition.y = Mathf.Clamp(newPosition.y, minY, maxY);
        transform.position = newPosition;

        if (isMoving)  
        {
            ApplyBobbingBasedOnYPosition(transform.position.y);
        }

        AdjustScale(newPosition.y);

        if (yFollower != null)
        {
            UpdateYFollower(newPosition.y);
        }

        Flip(horizontalInput);
    }

    public float GetValueBasedOnPos(float currentYorX, float minValue, float maxValue)
    {
        float scale = Mathf.InverseLerp(maxY, minY, currentYorX);
        return Mathf.Lerp(minValue, maxValue, scale);
    }

    void ApplyBobbingBasedOnYPosition(float currentY)
    {
        float bobbingAmount = GetValueBasedOnPos(currentY, bobbingAmountAtPointB, bobbingAmountAtPointA);
        float bobbingOffset = Mathf.Sin(Time.time * baseBobbingSpeed) * bobbingAmount;
        Vector3 bobbingPosition = initialShrinkTargetPosition;
        bobbingPosition.y += bobbingOffset;
        shrinkTarget.localPosition = bobbingPosition;
    }

    void AdjustScale(float currentY)
    {
        float newScale = GetValueBasedOnPos(currentY, scaleAtPointB, scaleAtPointA);
        shrinkTarget.localScale = Vector3.one * newScale;
    }

    void UpdateYFollower(float currentY)
    {
        float yOffset = GetValueBasedOnPos(currentY, yOffsetAtPointA, yOffsetAtPointB);

        Vector3 followerPosition = yFollower.position;
        followerPosition.y = currentY + yOffset;
        yFollower.position = followerPosition;

        float newScaleX = GetValueBasedOnPos(currentY, yFollowerScaleAtPointB, yFollowerScaleAtPointA);
        yFollower.localScale = Vector3.one * newScaleX;
    }

    void Flip(float horizontalInput)
    {
        if (horizontalInput > 0)
        {
            spriteRenderer.flipX = true;
        }
        else if (horizontalInput < 0)
        {
            spriteRenderer.flipX = false;
        }
    }
}
